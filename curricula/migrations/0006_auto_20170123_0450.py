# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-01-23 04:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('curricula', '0005_auto_20170123_0330'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='answer_type',
        ),
        migrations.AlterField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='curricula.Question'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='module',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='curricula.Module'),
        ),
        migrations.AlterField(
            model_name='module',
            name='unit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modules', to='curricula.Unit'),
        ),
        migrations.AlterField(
            model_name='question',
            name='lesson',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='curricula.Lesson'),
        ),
        migrations.AlterField(
            model_name='unit',
            name='curriculum',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='units', to='curricula.Curriculum'),
        ),
    ]
