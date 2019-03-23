# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-03-23 08:04
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_light_enums.db


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('curricula', '0035_auto_20190323_1051'),
    ]

    operations = [
        migrations.CreateModel(
            name='LessonBadges',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.AddField(
            model_name='lessonbadges',
            name='lesson',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='curricula.Lesson'),
        ),
        migrations.AddField(
            model_name='lessonbadges',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
