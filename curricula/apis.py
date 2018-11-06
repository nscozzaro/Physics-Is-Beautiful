import datetime

from django.utils import timezone

# from django.db.models import Q

from rest_framework import serializers, status, permissions
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.exceptions import NotFound, NotAcceptable
from rest_framework.permissions import AllowAny, IsAuthenticated

# from drf_haystack.serializers import HaystackSerializer
# from drf_haystack.viewsets import HaystackViewSet

from .models import Curriculum, Unit, Module, Lesson, Question, Game, UnitConversion
from .services import get_progress_service, LessonLocked, LessonProgress

from .serializers import QuestionSerializer, UserResponseSerializer, AnswerSerializer,\
    LessonSerializer, ScoreBoardSerializer, ModuleSerializer, UnitSerializer,\
    CurriculumSerializer, LessonProgressSerializer

# from .search_indexes import CurriculumIndex

# from profiles.serializers import PublicProfileSerializer
# from pib_auth.models import User


def check_classroom_progress(service, user):
    if user.is_authenticated and service.current_lesson_progress.score >= service.COMPLETION_THRESHOLD:
        from classroom.models import AssignmentProgress

        AssignmentProgress.objects.recalculate_status_by_lesson(service.current_lesson, user)


class QuestionViewSet(ModelViewSet):

    serializer_class = QuestionSerializer
    queryset = Question.objects.all()
    permission_classes = []
    lookup_field = 'uuid'

    def user_response(self, request, uuid):
        question = self.get_object()
        data = {'question': question.pk, 'answered_on': timezone.now()}
        data.update(request.data)
        sr = UserResponseSerializer(data=data)
        sr.is_valid(raise_exception=True)
        kwargs = {}
        if request.user.is_authenticated():
            kwargs['profile'] = request.user.profile
        user_response = sr.get_response(**kwargs)
        service = get_progress_service(request, question.lesson)
        try:
            is_correct = service.check_user_response(user_response)
        except LessonLocked as e:
            raise serializers.ValidationError(e)
        data = LessonProgressSerializer(service.current_lesson_progress).data

        check_classroom_progress(service, self.request.user)

        data['required_score'] = service.COMPLETION_THRESHOLD
        data['was_correct'] = is_correct
        if not is_correct:
            if user_response.content:
                data['correct_answer'] = AnswerSerializer(user_response.get_correct_answer()).data
            elif user_response.answers_list:
                data['correct_answer'] = AnswerSerializer(user_response.get_correct_answer(), many=True).data
        return Response(data)


class LessonViewSet(ModelViewSet):

    serializer_class = LessonSerializer
    queryset = Lesson.objects.all()
    lookup_field = 'uuid'

    def get_serializer_context(self):
        context = super(LessonViewSet, self).get_serializer_context()
        context['progress_service'] = get_progress_service(context['request'])
        return context

    def get_next_question(self, request, uuid):
        lesson = self.get_object()
        service = get_progress_service(request, lesson)
        previous_question = None
        previous_question_uuid = request.query_params.get('previous_question')
        if previous_question_uuid:
            previous_question = Question.objects.filter(uuid=previous_question_uuid).first()
        try:
            question = service.get_next_question(previous_question)
        except LessonLocked as e:
            raise serializers.ValidationError(e)
        if question:
            data = QuestionSerializer(question, context={'progress_service': service}).data
            # TODO: it might make more sense for these fields to be on the
            # lesson. Or a separate lesson_profress object.
            data.update(LessonProgressSerializer(service.current_lesson_progress).data)
            data['required_score'] = service.COMPLETION_THRESHOLD
            return Response(data)
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_unit_conversion_units(request):
    return Response(UnitConversion.UnitConversionUnits)


@api_view(['POST'])
@permission_classes([AllowAny])
def game_success(request, uuid):
    try:
        game = Game.objects.get(lesson__uuid=uuid)
    except Game.DoesNotExist:
        raise NotFound()

    service = get_progress_service(request, game.lesson)

    n = 10  # max number of results to show

    duration_ms = request.data.get('duration', None)
    score = request.data.get('score', None)
    if duration_ms:
        dur = datetime.timedelta(milliseconds=duration_ms)
    else:
        dur = None

    service.game_success(game, dur, score)

    check_classroom_progress(service, request.user)

    if game.slug == 'unit-conversion' or game.slug == 'vector-game':  # temp fix
        # get score list for
        # try:
        scores = service.get_score_board_qs(game.lesson).exclude(duration__isnull=True)
        data_scores_list = []
        user_already_in_score_list = False

        for row_num, row in enumerate(scores[:10]):
            # add score if user in top 10
            # current registered user
            if request.user.is_authenticated:
                if request.user.profile.id == row.profile_id:
                    current_user_score = service.get_score_board_qs(game.lesson).\
                                                 get(profile__user=request.user)
                    setattr(current_user_score, 'row_num', row_num + 1)
                    data_scores_list.append(current_user_score)
                    user_already_in_score_list = True
                    continue
            # current anon user
            else:
                if row.duration > dur:
                    if not user_already_in_score_list:
                        current_user_score = LessonProgress(score=score, duration=dur, lesson=game.lesson)
                        setattr(current_user_score, 'row_num', row_num + 1)
                        data_scores_list.append(current_user_score)
                        user_already_in_score_list = True
                        continue

            setattr(row, 'row_num', row_num + 1)

            if row.duration:
                data_scores_list.append(row)

        # add score if user not in top 10
        if not user_already_in_score_list:
            if request.user.is_authenticated:
                current_user_score = service.get_score_board_qs(game.lesson).get(profile__user=request.user)
            else:
                current_user_score = LessonProgress(score=score, duration=dur, lesson=game.lesson)

            position = service.get_score_board_qs(game.lesson).filter(duration__lt=current_user_score.duration).count()
            setattr(current_user_score, 'row_num', position + 1)
            data_scores_list.append(current_user_score)

        data = ScoreBoardSerializer(data_scores_list[:n], many=True).data
        return Response(data)

    return Response(status=status.HTTP_204_NO_CONTENT)


class ModuleViewSet(ModelViewSet):

    serializer_class = ModuleSerializer
    queryset = Module.objects.all()
    lookup_field = 'uuid'

    def get_serializer_context(self):
        context = super(ModuleViewSet, self).get_serializer_context()
        context['progress_service'] = get_progress_service(context['request'])
        return context


class UnitViewSet(ModelViewSet):

    serializer_class = UnitSerializer
    queryset = Unit.objects.all()
    lookup_field = 'uuid'


class CurriculaViewSet(ModelViewSet):

    serializer_class = CurriculumSerializer
    queryset = Curriculum.objects.all()
    lookup_field = 'uuid'

    def get_queryset(self):
        queryset = self.queryset
        filter_by = self.request.query_params.get('filter', None)
        if filter_by and self.request.user.is_authenticated():
            if filter_by == 'my':
                # todo do we need to get curricula of user classrooms?
                queryset = queryset.filter(author=self.request.user)
            elif filter_by == 'other':
                queryset = queryset.exclude(author=self.request.user)
            elif filter_by == 'default':
                queryset = queryset.filter(author__pk=2)  # Physics Is Beautiful

        return queryset

    def get_serializer_context(self):
        context = super(CurriculaViewSet, self).get_serializer_context()
        context['progress_service'] = get_progress_service(context['request'])
        return context

    def get_object(self):
        lookup_id = self.kwargs.get(self.lookup_url_kwarg or self.lookup_field)
        if lookup_id and lookup_id.lower() == 'default':
            user = None
            if self.request.user.is_authenticated:
                user = self.request.user
            return Curriculum.objects.get_default(user=user)
        return super(CurriculaViewSet, self).get_object()


# Postgresql FTS Search
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank


class CurriculaSearchViewSet(ModelViewSet):
    serializer_class = CurriculumSerializer
    queryset = Curriculum.objects.all()
    lookup_field = 'uuid'

    def get_queryset(self):
        qs = self.queryset

        keywords = self.request.GET.get('query')
        if not keywords:
            raise NotAcceptable('Search query required')

        query = SearchQuery(keywords)
        vector = SearchVector('name', 'description')
        qs = qs.annotate(search=vector).filter(search=query)
        qs = qs.annotate(rank=SearchRank(vector, query)).order_by('-rank')


        return qs


# FTS Search

# class CurriculumSearchSerializer(HaystackSerializer):
#
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         # WO hitting DB
#         request = self.context.get('request', None)
#         if 'image' in representation and representation['image']:
#             if request is not None:
#                 representation['image'] = request.build_absolute_uri(representation['image'])
#         # With hitting DB
#         # representation['image'] = None
#         # if instance.object.image:
#         #     representation['image'] = instance.object.image.url
#
#         representation['author'] = {}
#         representation['author']['pk'] = instance.author_pk
#         representation['author']['get_absolute_url'] = instance.author_get_absolute_url
#         representation['author']['display_name'] = instance.author_display_name
#
#         return representation
#
#     class Meta:
#         index_classes = [CurriculumIndex]
#
#         # The `fields` contains all the fields we want to include.
#         # NOTE: Make sure you don't confuse these with model attributes. These
#         # fields belong to the search index!
#         fields = [
#             "text", "name", "description", "uuid", "image", "author"
#         ]
#
#
# class CurriculaSearchViewSet(HaystackViewSet):
#     permission_classes = [IsAuthenticated]
#     index_models = [Curriculum]
#     serializer_class = CurriculumSearchSerializer



