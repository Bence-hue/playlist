from django.contrib import admin
from .models import Song, BlockedUser, BlockedSong

# Register your models here.
admin.site.register(Song)
admin.site.register(BlockedUser)
admin.site.register(BlockedSong)
