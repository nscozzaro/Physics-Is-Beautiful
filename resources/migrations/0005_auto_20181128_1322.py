# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-11-28 10:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0004_auto_20181126_1226'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='textbooksolution',
            name='title',
        ),
        migrations.AddField(
            model_name='textbooksolution',
            name='_title',
            field=models.CharField(blank=True, db_column='title', default='', max_length=400),
        ),
    ]