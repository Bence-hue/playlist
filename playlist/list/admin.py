from django.contrib import admin
from .models import Song,Question,BlockedUser

# Register your models here.
admin.site.register(Song)
admin.site.register(Question)
admin.site.register(BlockedUser)
