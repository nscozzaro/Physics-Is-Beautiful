# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-06-12 08:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django_light_enums.db


class Migration(migrations.Migration):

    dependencies = [
        ('curricula', '0038_auto_20190512_1021'),
        ('djeddit', '__latest__'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='thread',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='course_question', to='djeddit.Thread'),
        ),
        migrations.AlterField(
            model_name='question',
            name='text',
            field=models.CharField(db_index=True, max_length=2048),
        ),
    ]
