from list.models import Song
from list.spotify import new,delete
import time

for l in Song.objects.all():
    delete(l.spotiuri)
    time.sleep(0.1)

for l in Song.objects.filter(played=False,hide=False):
    st,sl,su=new(l.artist+" "+l.title)
    l.spotititle=st
    l.spotilink=sl
    l.spotiuri=su
    l.save()
    time.sleep(0.1)
