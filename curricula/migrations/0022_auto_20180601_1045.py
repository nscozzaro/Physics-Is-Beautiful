# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-06-01 14:45
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('curricula', '0021_auto_20180601_1043'),
    ]

    operations = [
        migrations.AddField(
            model_name='curriculum',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
