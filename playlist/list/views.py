from django.shortcuts import render
import requests
from .models import Song
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt

# Create your views here.
def new_view(request, *args, **kwargs):
    data=dict(request.POST)
    print(data)
    URL="https://www.googleapis.com/youtube/v3/search"
    song=data["artist"][0]+" - "+data["title"][0]
    PARAMS={
        "part":"snippet",
        "key":"AIzaSyChwmrh7pX7jV1CXgAIq_cgLRtJ7wDTpE4",
        "type":"video",
        "maxResults":1,
        "q":song
    }
    r=requests.get(url = URL, params = PARAMS)
    respons=r.json()
    print(respons)
    link='https://youtube.com/watch?v='+respons["items"][0]["id"]["videoId"]
    print(link)
    Song.objects.create(title=data["title"][0],artist=data["artist"][0],link=link,user="anyad")
