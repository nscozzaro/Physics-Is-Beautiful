# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-12-19 10:05
from __future__ import unicode_literals

from django.db import migrations, models
import django_light_enums.db


class Migration(migrations.Migration):

    dependencies = [
        ('curricula', '0016_auto_20171213_2011'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='unitconversion',
            name='answer',
        ),
        migrations.AddField(
            model_name='unitconversion',
            name='answer_number',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='unitconversion',
            name='answer_unit',
            field=models.CharField(blank=True, help_text='Correct unit: m, s, kg, m/s, etc', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='unitconversion',
            name='question_number',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='unitconversion',
            name='question_unit',
            field=models.CharField(blank=True, help_text='Correct unit: m, s, kg, m/s, etc', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='lesson_type',
            field=django_light_enums.db.EnumField(choices=[(0, 'DEFAULT'), (1, 'GAME')], default=0, enum_values=(0, 1)),
        ),
        migrations.AlterField(
            model_name='lessonprogress',
            name='status',
            field=django_light_enums.db.EnumField(choices=[(0, 'LOCKED'), (10, 'NEW'), (20, 'UNLOCKED'), (30, 'COMPLETE')], default=0, enum_values=(0, 10, 20, 30)),
        ),
        migrations.AlterField(
            model_name='question',
            name='additional_text',
            field=models.CharField(blank=True, db_index=True, help_text='Not used field', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='answer_type',
            field=django_light_enums.db.EnumField(choices=[(0, 'UNDEFINED'), (50, 'MATHEMATICAL_EXPRESSION'), (20, 'VECTOR'), (70, 'UNIT_CONVERSION'), (40, 'IMAGE'), (10, 'TEXT'), (60, 'VECTOR_COMPONENTS'), (30, 'NULLABLE_VECTOR')], default=0, enum_values=(0, 50, 20, 70, 40, 10, 60, 30)),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=django_light_enums.db.EnumField(choices=[(0, 'UNDEFINED'), (10, 'SINGLE_ANSWER'), (20, 'MULTIPLE_CHOICE')], default=0, enum_values=(0, 10, 20)),
        ),
        migrations.AlterField(
            model_name='unitconversion',
            name='unit_conversion_type',
            field=models.CharField(choices=[('10', 'LEFT SIDE BLANK'), ('20', 'RIGHT SIDE BLANK'), ('30', 'ALL SIDES BLANK')], default='10', max_length=2),
        ),
    ]