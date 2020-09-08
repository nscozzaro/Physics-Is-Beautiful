# Generated by Django 2.2.15 on 2020-09-08 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0008_lesson_complete_boundary'),
    ]

    operations = [
        migrations.AddField(
            model_name='userreaction',
            name='last_reaction',
            field=models.BooleanField(default=True, verbose_name='Mark reaction as last for user'),
        ),
        migrations.AddConstraint(
            model_name='userreaction',
            constraint=models.UniqueConstraint(condition=models.Q(('last_reaction', True), ('profile__isnull', False)), fields=('last_reaction', 'profile_id', 'material_id'), name='unique__last_reaction_user'),
        ),
        migrations.AddConstraint(
            model_name='userreaction',
            constraint=models.UniqueConstraint(condition=models.Q(('anon_session_key__isnull', False), ('last_reaction', True)), fields=('last_reaction', 'anon_session_key', 'material_id'), name='unique__last_reaction_anon'),
        ),
    ]
