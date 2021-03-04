import os
from io import BytesIO

from PIL import Image

from enum import Enum

from django.db import models
from django.contrib.postgres.fields import JSONField
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.files.uploadedfile import InMemoryUploadedFile


from taggit.managers import TaggableManager
from djeddit.models import Thread

from . import Lesson, BaseItemModel, MaterialProblemType, get_earliest_gap
# from .storage import OverwriteStorage
from .utils import UUIDTaggedItem

try:
    course_question_thread_related_name = settings.DJEDDIT_RELATED_FIELDS['course_material']
except (KeyError, AttributeError):
    raise ImproperlyConfigured("Can't find settings.DJEDDIT_RELATED_FIELDS['course_material'] settings")


# it's seems we do not need this (only if determining type by 'game' in a material problem title is ugly)
# TODO resolve
class MaterialWorkflowType(Enum):
    # TODO create validation schema for all types
    COMMON = 10  # by default
    GAME = 20
    QA_COMMON = 80
    QA_MYSQL = 90


def uuid_as_name(instance, filename):
    try:
        file_extension = os.path.splitext(filename)[1]
    except IndexError:
        file_extension = '.png'
    # TODO add lesson subfolder?
    return 'materials_images/{0}{1}'.format(instance.pk, file_extension)


class Material(BaseItemModel):
    # class MaterialWorkflowType(models.IntegerChoices): # Django 3.0
    lesson = models.ForeignKey(Lesson, related_name='materials', on_delete=models.CASCADE)
    # material_workflow_type = models.IntegerField(choices=MaterialWorkflowType.choices) # Django 3.0
    # OverwriteStorage replaced with pre_save resize_and_delete_old_screenshot due S3
    screenshot = models.ImageField(null=True, blank=True, upload_to=uuid_as_name)  # storage=OverwriteStorage(),
    material_workflow_type = models.IntegerField(
        default=MaterialWorkflowType.COMMON.value,
        choices=[(type.value, type) for type in MaterialWorkflowType]
    )
    position = models.PositiveSmallIntegerField('Position', null=True, blank=True)
    material_problem_type = models.ForeignKey(
        MaterialProblemType, related_name='materials', on_delete=models.CASCADE,
        null=True, blank=True  # we can create empty Material w/o type selected
    )
    # this is a data that uses by material_problem_type
    data = JSONField(default=dict)  # only Postgresql support!

    thread = models.OneToOneField(Thread, related_name=course_question_thread_related_name, null=True,
                                  on_delete=models.CASCADE)
    tags = TaggableManager(through=UUIDTaggedItem, related_name='courses_materials')

    def get_correct_data(self):
        # return correct data
        return self.data

    def __str__(self):
        return 'Material: {}'.format(self.name)

    class Meta:
        ordering = ['position']


@receiver(pre_save, sender=Material)
def resize_and_delete_old_screenshot(sender, instance, **kwargs):
    output_size = (300, 300)

    if instance.screenshot:
        image = Image.open(instance.screenshot_url.file.file)

        file_class_name = type(instance.screenshot.file).__name__

        # if we have new in memory file, remove old file of screen:
        if file_class_name == 'InMemoryUploadedFile':
            old_material = Material.objects.get(pk=instance.pk)
            old_material.screenshot.delete()

        # do not resize if already resized
        if image.height > output_size[0] or image.width > output_size[1]:
            image.thumbnail(size=output_size)
            image_file = BytesIO()
            image.save(image_file, image.format)

            instance.screenshot.save(
                instance.screenshot.name,
                InMemoryUploadedFile(
                    image_file,
                    None, '',
                    instance.screenshot.file.content_type,
                    image.size,
                    instance.screenshot.file.charset,
                ),
                save=False
            )


@receiver(pre_save, sender=Material)
def set_position(sender, instance, **kwargs):
    if instance.position is None:
        taken_positions = list(
            Material.objects.filter(lesson=instance.lesson).values_list('position', flat=True)
        )
        instance.position = get_earliest_gap(taken_positions)
