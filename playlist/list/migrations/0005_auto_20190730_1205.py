# Generated by Django 2.2.3 on 2019-07-30 10:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('list', '0004_auto_20190730_1203'),
    ]

    operations = [
        migrations.RenameField(
            model_name='blockeduser',
            old_name='uuid',
            new_name='userid',
        ),
    ]
