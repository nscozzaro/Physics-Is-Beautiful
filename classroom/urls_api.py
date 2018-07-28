from django.conf.urls import url, include

from rest_framework import routers
from .apis import ClassroomViewSet, join_classroom, leave_classroom

urlpatterns = [
            url(r'join/$', join_classroom),
            url(r'leave/$', leave_classroom)
]

router = routers.DefaultRouter()
router.register(r'', ClassroomViewSet, base_name='classroom')

urlpatterns += router.urls
