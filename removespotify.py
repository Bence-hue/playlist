from list.models import Song
from list.spotify import new

for l in Song.objects.all():
    new(l.spotiuri)