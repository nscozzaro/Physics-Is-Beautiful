# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-12-10 11:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0012_auto_20181210_1230'),
    ]

    operations = [
        migrations.AddField(
            model_name='textbooksolution',
            name='created_on',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='textbooksolution',
            name='updated_on',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
