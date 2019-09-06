from django.contrib import admin
from .models import Song,Question,BlockedUser,BlockedSong,Setting

# Register your models here.
admin.site.register(Song)
admin.site.register(Question)
admin.site.register(BlockedUser)
admin.site.register(BlockedSong)
admin.site.register(Setting)