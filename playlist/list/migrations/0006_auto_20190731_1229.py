# Generated by Django 2.2.3 on 2019-07-31 10:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('list', '0005_auto_20190730_1205'),
    ]

    operations = [
        migrations.DeleteModel(
            name='BlockedSong',
        ),
        migrations.DeleteModel(
            name='BlockedUser',
        ),
    ]