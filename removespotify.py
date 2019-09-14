from list.models import Song
from list.spotify import delete

for l in Song.objects.all():
    delete(l.spotiuri)