from django.contrib import admin
from .models import Song,BlockedUser,Setting,Log,Spotiuser


# Register your models here.
admin.site.register(Song)
admin.site.register(BlockedUser)
admin.site.register(Setting)
admin.site.register(Log)
admin.site.register(Spotiuser)
