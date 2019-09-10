from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Song(models.Model):
    title=models.CharField(max_length=100)
    artist=models.CharField(max_length=100)
    yttitle = models.CharField(max_length=100, null=True, blank=True)
    link=models.URLField(null=True,blank=True)
    user=models.CharField(max_length=36)
    createdAt=models.DateTimeField(auto_now_add=True,null=True)
    played=models.BooleanField(default=False)
    playedAt=models.DateTimeField(null=True,blank=True)
    hide=models.BooleanField(default=False)

class BlockedUser(models.Model):
    userid=models.UUIDField()
    permanent=models.BooleanField(default=False)
    expireAt=models.DateTimeField(blank=True,null=True)
    class Meta:
        permissions=[
            ("can_ban","Tud un/bannolni")
        ]

class Setting(models.Model):
    name=models.CharField(max_length=100,unique=True)
    value=models.IntegerField()
    class Meta:
        permissions=[
            ("can_modify_settings","Tud állítani a beállításokon")
        ]

class Log(models.Model):
    user=models.ForeignKey(User,models.SET_NULL,null=True)
    title=models.CharField(max_length=100)
    content=models.CharField(max_length=200)
    time=models.DateTimeField(auto_now_add=True)