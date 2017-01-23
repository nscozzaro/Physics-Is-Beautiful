# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-01-22 04:39
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('position', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Position')),
                ('object_id', models.PositiveIntegerField()),
                ('is_correct', models.BooleanField(default=False)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
            options={
                'ordering': ['position'],
                'db_table': 'curricula_answers',
            },
        ),
        migrations.CreateModel(
            name='Curriculum',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=200)),
                ('published_on', models.DateTimeField(blank=True, null=True, verbose_name='date published')),
                ('image', models.ImageField(upload_to='')),
            ],
            options={
                'verbose_name_plural': 'curricula',
                'db_table': 'curricula_curricula',
            },
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=200)),
                ('published_on', models.DateTimeField(blank=True, null=True, verbose_name='date published')),
                ('image', models.ImageField(blank=True, upload_to='')),
                ('position', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Position')),
            ],
            options={
                'ordering': ['position'],
                'db_table': 'curricula_lessons',
            },
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=200)),
                ('published_on', models.DateTimeField(blank=True, null=True, verbose_name='date published')),
                ('image', models.ImageField(blank=True, upload_to='')),
                ('position', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Position')),
            ],
            options={
                'ordering': ['position'],
                'db_table': 'curricula_modules',
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('text', models.CharField(max_length=200)),
                ('published_on', models.DateTimeField(blank=True, null=True, verbose_name='date published')),
                ('image', models.ImageField(blank=True, upload_to='')),
                ('position', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Position')),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='curricula.Lesson')),
            ],
            options={
                'ordering': ['position'],
                'db_table': 'curricula_questions',
            },
        ),
        migrations.CreateModel(
            name='Text',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('text', models.CharField(max_length=200)),
            ],
            options={
                'db_table': 'curricula_text_answers',
            },
        ),
        migrations.CreateModel(
            name='Unit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=200)),
                ('published_on', models.DateTimeField(blank=True, null=True, verbose_name='date published')),
                ('image', models.ImageField(upload_to='')),
                ('position', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Position')),
                ('curriculum', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='curricula.Curriculum')),
            ],
            options={
                'ordering': ['position'],
                'db_table': 'curricula_units',
            },
        ),
        migrations.CreateModel(
            name='Vector',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('magnitude', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Magnitude')),
                ('angle', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Angle')),
                ('xComponent', models.SmallIntegerField(blank=True, null=True, verbose_name='x-Component')),
                ('yComponent', models.SmallIntegerField(blank=True, null=True, verbose_name='y-Component')),
            ],
            options={
                'db_table': 'curricula_vector_answers',
            },
        ),
        migrations.AddField(
            model_name='module',
            name='unit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='curricula.Unit'),
        ),
        migrations.AddField(
            model_name='lesson',
            name='module',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='curricula.Module'),
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='curricula.Question'),
        ),
    ]
