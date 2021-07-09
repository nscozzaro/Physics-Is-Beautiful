# Generated by Django 2.2.24 on 2021-07-09 03:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0016_auto_20210624_0407'),
        ('profiles', '0006_profile_profile_views'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='selected_course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='courses.Course'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='google_avatar_url',
            field=models.URLField(blank=True, max_length=2048, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='gravatar_url',
            field=models.URLField(blank=True, max_length=2048, null=True),
        ),
    ]