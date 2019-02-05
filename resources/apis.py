import os
from datetime import timedelta
from urllib.parse import urlparse

from django.core.files.base import ContentFile
from django.utils import timezone
from django.db.models import F, Count, Prefetch, Max
from django.db import transaction

from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework import permissions, status, mixins, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser, FileUploadParser
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound, ValidationError

from djeddit.models import Topic, Thread, Post

# from django_filters.rest_framework import DjangoFilterBackend

# from profiles.models import Profile

from .permissions import IsStaffOrReadOnly

from piblib.drf.views_set_mixins import SeparateListObjectSerializerMixin, SeparateFlatCreateUpdateObjectSerializerMixin

from .models import Resource, TextBookSolutionPDF, RecentUserResource, TextBookProblem, TextBookSolution, TextBookChapter

from .serializers import ResourceBaseSerializer, ResourceListSerializer, TextBookSolutionPDFSerializer, \
    FullTextBookProblemSerializer, TextBookSolutionSerializer, TextBookProblemSerializer
from .serializers_flat import TextBookChapterSerializerFlat, TextBookProblemSerializerFlat

from .settings import TEXTBOOK_PROBLEMS_SOLUTIONS_TOPIC_ID, SYSTEM_USER_ID


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # TODO get it from the project settings


class RecentlyFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if request.user.is_authenticated:
            filter_param = request.query_params.get('filter')
            if filter_param and filter_param == 'recent':
                queryset = queryset.\
                    filter(user_recent_list__user__user=request.user).\
                    order_by('-user_recent_list__last_access_date')
                # queryset = queryset.filter(curricula_user_dashboard__profile__user=request.user\)
        return queryset


class TextBookChaptersViewSet(# mixins.RetrieveModelMixin,
                              mixins.CreateModelMixin,
                              mixins.UpdateModelMixin,
                              mixins.DestroyModelMixin,
                              GenericViewSet):
    permission_classes = (IsStaffOrReadOnly,)
    serializer_class = TextBookChapterSerializerFlat  # we use flat only with post & patch
    queryset = TextBookChapter.objects.all()
    lookup_field = 'id'

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user.profile)


class TextBookProblemsViewSet(SeparateFlatCreateUpdateObjectSerializerMixin,
                              mixins.RetrieveModelMixin,
                              mixins.CreateModelMixin,
                              mixins.UpdateModelMixin,
                              mixins.DestroyModelMixin,
                              GenericViewSet):
    permission_classes = (IsStaffOrReadOnly, )
    serializer_class_flat = TextBookProblemSerializerFlat  # we use flat only with post & patch
    serializer_class = TextBookProblemSerializer
    queryset = TextBookProblem.objects.\
        prefetch_related('solutions', 'solutions__posted_by', 'solutions__pdf', 'solutions__thread').\
        all()
    # annotate(count_solutions=Count('solutions', distinct=True)).\
    # todo add denorm field for thread posts count.

    lookup_field = 'uuid'
    # filter_backends = (filters.OrderingFilter,)
    # # ordering_fields = ('solutions__created_on', )
    # ordering_fields = ('solutions__vote_score', )
    # ordering = ('-solutions__vote_score',)

    def get_queryset(self):
        if 'ordering' in self.request.query_params and self.request.query_params['ordering'] == '-solutions__created_on':
            # it seems drf do not work with reverse foreign related ordering, need to investigate
            # or replace TextBookProblem solutions list with a separate API query
            qs = self.queryset.prefetch_related(
              Prefetch(
                'solutions',
                queryset=TextBookSolution.objects.all().order_by('-created_on'),
                )).all()
            return qs

        return self.queryset

    def perform_create(self, serializer):
        # with transaction.atomic():
        #     if 'textbook_section' not in serializer.validated_data:
        #         raise ValidationError('textbook_section field not found')
        #     position = self.queryset.filter(textbook_section=serializer.validated_data['textbook_section']).count()
        #     serializer.save(posted_by=self.request.user.profile, position=position)
        serializer.save(posted_by=self.request.user.profile)


class TextBookSolutionsViewSet(mixins.RetrieveModelMixin,
                               mixins.CreateModelMixin,
                               mixins.UpdateModelMixin,
                               GenericViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)  # users can send soltions
    serializer_class = TextBookSolutionSerializer
    queryset = TextBookSolution.objects.all()
    # .annotate(count_votes=Count('votes', distinct=True))
    lookup_field = 'uuid'

    @action(methods=['POST'],
            detail=True,
            permission_classes=[permissions.IsAuthenticated, ],)
    def vote(self, request, uuid):
        try:
            solution = TextBookSolution.objects.get(uuid=uuid)
        except TextBookSolution.DoesNotExist:
            raise NotFound()

        value = request.data.get('value', None)

        if not value or value not in (-1, 1):
            raise ValidationError('vote value must be 1 or -1')

        if value == 1:
            solution.votes.up(request.user.id)
        else:
            solution.votes.down(request.user.id)

        # TODO calculate votes for djedit

        return Response(status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        # try to find user last access date
        instance = self.get_object()

        # get or create comments solutions topic / solution thread / .
        if instance:
            new_thread = None
            try:
                solutions_topic = Topic.objects.get(id=TEXTBOOK_PROBLEMS_SOLUTIONS_TOPIC_ID)
            except Topic.DoesNotExist:
                solutions_topic = Topic.objects.create(title='Textbook problems solutions', id=TEXTBOOK_PROBLEMS_SOLUTIONS_TOPIC_ID)

            if not instance.thread:
                with transaction.atomic():
                    solutions_post = Post.objects.create(created_by_id=SYSTEM_USER_ID)
                    title = ''
                    if instance.textbook_problem.textbook_section.resource.resource_type == 'TB':
                        # get resourse title from metadata
                        if 'title' in instance.textbook_problem.textbook_section.resource.metadata.data['volumeInfo']:
                            title = '{}'.format(instance.textbook_problem.textbook_section.resource.metadata.data['volumeInfo']['title'])
                    else:
                        title = '{}'.format('Unknwon rsource name')

                    title = '{} / {}'.format(title, instance.textbook_problem.textbook_section.title)
                    title = '{} / {}'.format(title, instance.textbook_problem.title)
                    title = '{} / {}'.format(title, instance.title)

                    new_thread = Thread.objects.create(title=title[:199], topic=solutions_topic, op=solutions_post)

            # increment view count
            # Resource.unmoderated_objects.filter(pk=instance.pk).update(count_views=F('count_views') + 1)
            if new_thread:
                TextBookSolution.objects.filter(pk=instance.pk).update(count_views=F('count_views') + 1, thread=new_thread)
            else:
                TextBookSolution.objects.filter(pk=instance.pk).update(count_views=F('count_views') + 1)

        return super(TextBookSolutionsViewSet, self).retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        with transaction.atomic():
            if 'textbook_problem' not in serializer.validated_data:
                raise ValidationError('textbook_problem field not found')
            position = self.queryset.filter(textbook_problem=serializer.validated_data['textbook_problem']).count()
            serializer.save(posted_by=self.request.user.profile, position=position)


class ResourceViewSet(SeparateListObjectSerializerMixin, ModelViewSet):
    permission_classes = (IsStaffOrReadOnly, )
    serializer_class = ResourceBaseSerializer
    list_serializer_class = ResourceListSerializer
    pagination_class = StandardResultsSetPagination
    queryset = Resource.objects.all().\
        order_by('-created_on').\
        select_related('metadata'). \
        prefetch_related(Prefetch('sections__problems',
                         queryset=TextBookProblem.objects.
                                  annotate(count_solutions=Count('solutions', distinct=True)))
                         )\
        .prefetch_related('sections__problems__solutions__posted_by')\
        .prefetch_related('sections__problems__solutions__pdf')

    filter_backends = (filters.OrderingFilter, RecentlyFilterBackend)  # DjangoFilterBackend,
    lookup_field = 'uuid'

    @action(methods=['POST'],
            detail=False,
            permission_classes=[permissions.IsAuthenticated,],
            parser_classes=(FormParser, MultiPartParser, FileUploadParser))
    def upload_solution_pdf(self, request):
        self.remove_unrelated_pdfs()

        serializer = TextBookSolutionPDFSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response(serializer.data)

    @action(methods=['POST'],
            detail=False,
            permission_classes=[permissions.IsAuthenticated, ])
    def upload_direct_pdf(self, request):
        self.remove_unrelated_pdfs()
        # download data from external url, check it content, save serializer
        if 'url' not in request.data or not request.data['url']:
            raise ValidationError('url field not found')

        file_url = request.data['url']

        import requests

        # TODO Check filesize (chunk downloading?)

        # check file ext
        if not file_url.endswith('.pdf'):
            raise ValidationError('Not a pdf file')

        data = requests.get(file_url)

        a = urlparse(file_url)
        file_name = os.path.basename(a.path)

        pdf = ContentFile(data.content, name=file_name)

        # serializer = TextBookSolutionPDFSerializer(data=request.data)
        serializer = TextBookSolutionPDFSerializer(data={'file': pdf, 'external_url': file_url})
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response(serializer.data)

    def remove_unrelated_pdfs(self):
        # remove pdfs without related TextBookSolution
        month_ago = timezone.now() - timedelta(30)
        TextBookSolutionPDF.objects.filter(created_on__lt=month_ago, solution__isnull=True).delete()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    def retrieve(self, request, *args, **kwargs):
        # try to find user last access date
        instance = self.get_object()
        if request.user.is_authenticated:
            try:
                user_access = RecentUserResource.objects.get(user=request.user.profile, resource=instance)
                user_access.last_access_date = timezone.now()
                user_access.save()
            except RecentUserResource.DoesNotExist:
                RecentUserResource.objects.create(user=request.user.profile, resource=instance)

        # increment view count
        if instance:
            # Resource.unmoderated_objects.filter(pk=instance.pk).update(count_views=F('count_views') + 1)
            Resource.objects.filter(pk=instance.pk).update(count_views=F('count_views') + 1)

        return super(ResourceViewSet, self).retrieve(request, *args, **kwargs)



