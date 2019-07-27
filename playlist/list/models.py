from django.db import models

# Create your models here.
class Song(models.Model):
    title=models.CharField(max_length=100)
    artist=models.CharField(max_length=100)
    link=models.URLField()
    user=models.CharField(max_length=36)
    createdAt=models.DateTimeField(auto_now_add=True,null=True)
    played=models.BooleanField(default=False)
    playedAt=models.DateTimeField(null=True,blank=True)
