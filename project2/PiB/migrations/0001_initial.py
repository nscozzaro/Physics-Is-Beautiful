# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-01-05 17:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Curriculum',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('curriculum_name', models.CharField(max_length=200)),
                ('pub_date', models.DateTimeField(verbose_name=b'date published')),
            ],
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('module_name', models.CharField(max_length=200)),
                ('pub_date', models.DateTimeField(verbose_name=b'date published')),
                ('module_image', models.ImageField(upload_to=b'')),
            ],
        ),
        migrations.CreateModel(
            name='Unit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unit_name', models.CharField(max_length=200)),
                ('pub_date', models.DateTimeField(verbose_name=b'date published')),
                ('curriculum', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='PiB.Curriculum')),
            ],
        ),
        migrations.AddField(
            model_name='module',
            name='unit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='PiB.Unit'),
        ),
        migrations.AlterOrderWithRespectTo(
            name='unit',
            order_with_respect_to='curriculum',
        ),
        migrations.AlterOrderWithRespectTo(
            name='module',
            order_with_respect_to='unit',
        ),
    ]
