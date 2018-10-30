# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-10-30 12:35
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django_light_enums.db


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_auto_20180911_1204'),
        ('curricula', '0032_auto_20181009_1022'),
    ]

    operations = [
        migrations.CreateModel(
            name='CurriculumUserDashboard',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'curricula_userdashboard',
            },
        ),
        migrations.AlterField(
            model_name='curriculum',
            name='description',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AddField(
            model_name='curriculumuserdashboard',
            name='curriculum',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='curricula_user_dashboard', to='curricula.Curriculum'),
        ),
        migrations.AddField(
            model_name='curriculumuserdashboard',
            name='profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dashboard_curricula', to='profiles.Profile'),
        ),
        migrations.AlterUniqueTogether(
            name='curriculumuserdashboard',
            unique_together=set([('profile', 'curriculum')]),
        ),
    ]
