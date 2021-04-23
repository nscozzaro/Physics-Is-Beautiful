# Generated by Django 2.2.15 on 2021-04-15 15:02

from django.db import migrations, models
import django.db.models.deletion

from ..management.commands.migrate_comments_from_djeddit import copy_comments


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0014_materialproblemtypesandboxcache_timestamp'),
        ('react_comments_django', '0001_initial')
    ]

    def copy_topics_from_djeddit(apps, schema_editor):
        DJThread = apps.get_model('djeddit', 'Thread')
        DJTopic = apps.get_model('djeddit', 'Topic')
        DJPost = apps.get_model('djeddit', 'Post')
        DJUserPostVote = apps.get_model('djeddit', 'UserPostVote')

        Thread = apps.get_model('react_comments_django', 'Thread')
        Topic = apps.get_model('react_comments_django', 'Topic')
        Post = apps.get_model('react_comments_django', 'Post')
        UserPostVote = apps.get_model('react_comments_django', 'UserPostVote')

        kwargs = {
            '_DJThread': DJThread,
            '_DJTopic': DJTopic,
            '_DJPost': DJPost,
            '_DJUserPostVote': DJUserPostVote,
            '_Topic': Topic,
            '_Thread': Thread,
            '_Post': Post,
            '_UserPostVote': UserPostVote
        }

        copy_comments(**kwargs)

    operations = [
        migrations.RunPython(copy_topics_from_djeddit),
        migrations.AlterField(
            model_name='material',
            name='thread',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='course_material', to='react_comments_django.Thread'),
        ),
        migrations.AlterField(
            model_name='uuidtaggeditem',
            name='content_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses_uuidtaggeditem_tagged_items', to='contenttypes.ContentType', verbose_name='content type'),
        ),
        migrations.AlterField(
            model_name='uuidtaggeditem',
            name='object_id',
            field=models.UUIDField(db_index=True, verbose_name='object ID'),
        ),
    ]
