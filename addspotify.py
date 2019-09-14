from list.models import Song
from list.spotify import new

for l in Song.objects.all():
    st,sl,su=new(l.artist+" "+l.title)
    l.spotititle=st
    l.spotilink=sl
    l.spotiuri=su
    l.save()