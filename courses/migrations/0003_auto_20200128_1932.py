# Generated by Django 2.2.8 on 2020-01-28 16:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_auto_20200123_2054'),
    ]

    operations = [
        migrations.AlterField(
            model_name='materialproblemtypesandboxcache',
            name='sandbox',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cache', to='courses.MaterialProblemTypeSandbox'),
        ),
    ]
