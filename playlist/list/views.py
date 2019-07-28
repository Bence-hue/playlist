from django.shortcuts import render
from django.http import HttpResponse
import requests
from .models import Song
from django.views.decorators.csrf import csrf_exempt
import datetime
from django.utils import timezone
from django.core import serializers
import json

@csrf_exempt

# Create your views here.
def new_view(request, *args, **kwargs):
    if request.method == 'POST':
        data=dict(request.POST)
        print(data)
        URL="https://www.googleapis.com/youtube/v3/search"
        song=data.get("artist","")[0]+" - "+data.get("title","")[0]
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
        yttitle=respons["items"][0]["snippet"]["title"]
        print(link)
        user=request.COOKIES.get("userid","XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")
        lastrecord=Song.objects.filter(createdAt__gte=datetime.datetime.now()-datetime.timedelta(minutes=15)).filter(user=user)
        if lastrecord.exists():
            remaining=int((datetime.timedelta(minutes=15)-(timezone.now()-lastrecord.get().createdAt)).total_seconds())
            print(remaining)
            return HttpResponse(str(int(remaining/60))+":"+"{:02d}".format(remaining%60), status=429)
        else:
            Song.objects.create(title=data["title"][0],artist=data["artist"][0],link=link,user=user,yttitle=yttitle)
            return HttpResponse(status=201)
    else:
        return HttpResponse(status=405)

@csrf_exempt
def played_view(request,*args,**kwargs):
    if request.method == 'POST':
        id=int(dict(request.POST)["id"][0])
        print(id)
        object=Song.objects.filter(id=id)
        if object.exists():
            object.update(played=True,playedAt=datetime.datetime.now())
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=422)
    else:
        return HttpResponse(status=405)

@csrf_exempt
def delete_view(request,*args,**kwargs):
    if request.method == 'POST':
        id=int(dict(request.POST)["id"][0])
        print(id)
        object=Song.objects.filter(id=id)
        if object.exists():
            object.delete()
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=422)
    else:
        return HttpResponse(status=405)

@csrf_exempt
def list_view(request,*args,**kwargs):
    if request.method=='GET':
        mode = dict(request.GET)["mode"][0]
        if mode=="all":
            return jsonmodifier(serializers.serialize("json", Song.objects.all()))
        elif mode=="unplayed":
            return jsonmodifier(serializers.serialize("json", Song.objects.filter(played=False)))
        elif mode=="latest":
            full = json.loads(serializers.serialize("json",Song.objects.all()))
            latestid=full[len(full)-1]["pk"]
            latestobject = json.loads(serializers.serialize("json", Song.objects.filter(id=latestid)))
            print(latestobject)
            latestjson=latestobject[0]["fields"]
            latestjson["id"]=latestid
            return HttpResponse(json.dumps(latestjson), content_type="application/json", status=200)
        else:
            return HttpResponse(status=422)
    else:
        return HttpResponse(status=405)

def jsonmodifier(data):
    datajson=json.loads(data)
    print(datajson)
    newdata=[]
    for i in datajson:
        newdict=i["fields"]
        newdict["id"]=i["pk"]
        newdata.append(newdict)
    return HttpResponse(json.dumps(newdata), content_type="application/json", status=200)
