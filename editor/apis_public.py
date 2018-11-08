from django.db.models import Q, Count, Max, F

from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import permissions, status, generics, mixins
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, NotAcceptable
from rest_framework import filters

from django_filters.rest_framework import DjangoFilterBackend

from curricula.models import Curriculum, Unit, Module, Lesson, Question, Answer, CurriculumUserDashboard

from editor.serializers_public import PublicCurriculumSerializer, PublicUnitSerializer, PublicModuleSerializer, \
    PublisLessonSerializer, PublicQuestionSerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10


class RecentlyFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        filter_param = request.query_params.get('filter')
        if filter_param and filter_param == 'recent':
                # filter for recently Curricula for current user
                # queryset = queryset. \
                #     filter(units__modules__lessons__progress__profile__user=request.user). \
                #     annotate(updated_on_lastest=Max('units__modules__lessons__progress__updated_on')). \
                #     filter(units__modules__lessons__progress__updated_on=F('updated_on_lastest')). \
                #     order_by('-updated_on_lastest').distinct()
                queryset = queryset.filter(curricula_user_dashboard__profile__user=request.user)
        return queryset


class CurriculumViewSet(mixins.UpdateModelMixin,
                        mixins.ListModelMixin,
                        GenericViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = PublicCurriculumSerializer
    # serializer_class = CurriculumSerializer
    pagination_class = StandardResultsSetPagination

    filter_backends = (filters.OrderingFilter, DjangoFilterBackend, RecentlyFilterBackend)  # ordering and search support
    ordering_fields = ('number_of_learners_denormalized', 'published_on', 'created_on',
                       'units__modules__lessons__progress__updated_on')
    lookup_field = 'uuid'
    # ordering = ('-number_of_learners_denormalized',)

    @action(methods=['GET'], detail=False, permission_classes=[permissions.IsAuthenticated, ])
    def search(self, request):

        qs = self.get_queryset()

        keywords = request.GET.get('query')
        if not keywords:
            raise NotAcceptable('Search query required')

        query = SearchQuery(keywords)
        vector = SearchVector('name', 'description')
        qs = qs.annotate(search=vector).filter(search=query)
        qs = qs.annotate(rank=SearchRank(vector, query)).order_by('-rank')

        # search pagination
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)

        return Response(serializer.data)

    @action(methods=['POST'], detail=True, permission_classes=[permissions.IsAuthenticated, ])
    def add_to_dashboard(self, request, uuid):
        try:
            curriculum = Curriculum.objects.get(uuid=uuid)
        except Curriculum.DoesNotExist:
            raise NotFound()
        CurriculumUserDashboard.objects.get_or_create(
            profile=request.user.profile,
            curriculum=curriculum
        )

        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['POST'], detail=True, permission_classes=[permissions.IsAuthenticated, ])
    def remove_from_dashboard(self, request, uuid):
        try:
            curriculum_user_dashboard = CurriculumUserDashboard.objects.get(profile=request.user.profile,
                                                                            curriculum__uuid=uuid)
        except CurriculumUserDashboard.DoesNotExist:
            raise NotFound()

        curriculum_user_dashboard.delete()

        return Response(status=status.HTTP_200_OK)

    def get_queryset(self):
        return Curriculum.objects.filter(
              Q(setting_publically=True) |
              (Q(author=self.request.user) | Q(collaborators=self.request.user.profile))).\
            select_related('author').\
            annotate(count_lessons=Count('units__modules__lessons', distinct=True)).\
            order_by('-published_on').\
            distinct()


# # Postgresql FTS Search
# from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
#
#
# class CurriculaSearchViewSet(mixins.ListModelMixin,
#                              GenericViewSet):
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = CurriculumSerializer
#     queryset = Curriculum.objects.all()
#     lookup_field = 'uuid'
#
#     def get_queryset(self):
#         qs = self.queryset
#
#         keywords = self.request.GET.get('query')
#         if not keywords:
#             raise NotAcceptable('Search query required')
#
#         query = SearchQuery(keywords)
#         vector = SearchVector('name', 'description')
#         qs = qs.annotate(search=vector).filter(search=query)
#         qs = qs.annotate(rank=SearchRank(vector, query)).order_by('-rank')
#
#         return qs

# TODO order by "popular" all by number of learners

class UnitViewSet(mixins.UpdateModelMixin,
                  mixins.ListModelMixin,
                  GenericViewSet):
    permission_classes = (permissions.IsAuthenticated, )
    queryset = Unit.objects.all()
    serializer_class = PublicUnitSerializer
    lookup_field = 'uuid'
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return self.queryset.filter(Q(curriculum__setting_publically=True) |
                                     (Q(curriculum__author=self.request.user) |
                                      Q(curriculum__collaborators=self.request.user.profile))).distinct()


class ModuleViewSet(mixins.UpdateModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet):
    permission_classes = (permissions.IsAuthenticated, )
    queryset = Module.objects.all()
    serializer_class = PublicModuleSerializer
    lookup_field = 'uuid'
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return self.queryset.filter(Q(unit__curriculum__setting_publically=True) |
                                     (Q(unit__curriculum__author=self.request.user) |
                                      Q(unit__curriculum__collaborators=self.request.user.profile))).distinct()


class LessonViewSet(mixins.UpdateModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet):
    permission_classes = (permissions.IsAuthenticated, )
    queryset = Lesson.objects.all()
    serializer_class = PublisLessonSerializer
    lookup_field = 'uuid'
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return self.queryset.filter(Q(module__unit__curriculum__setting_publically=True) |
                                     (Q(module__unit__curriculum__author=self.request.user) |
                                      Q(module__unit__curriculum__collaborators=self.request.user.profile))).distinct()


class QuestionViewSet(mixins.UpdateModelMixin,
                      mixins.ListModelMixin,
                      GenericViewSet):
    permission_classes = (permissions.IsAuthenticated, )
    queryset = Question.objects.all()
    serializer_class = PublicQuestionSerializer
    lookup_field = 'uuid'
    pagination_class = StandardResultsSetPagination

    # search will be use text, hint text, answers texts

    def get_queryset(self):
        return self.queryset.filter(Q(lesson__module__unit__curriculum__setting_publically=True) |
                                     (Q(lesson__module__unit__curriculum__author=self.request.user) |
                                      Q(lesson__module__unit__curriculum__collaborators=self.request.user.profile))).distinct()
