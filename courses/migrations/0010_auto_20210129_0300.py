# Generated by Django 2.2.15 on 2021-01-29 08:00

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0009_auto_20200908_1029'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userreaction',
            name='answered_on',
        ),
        migrations.AddField(
            model_name='userreaction',
            name='reacted_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='userreaction',
            name='reaction_start_on',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userreaction',
            name='score',
            field=models.SmallIntegerField(default=0),
        ),
    ]