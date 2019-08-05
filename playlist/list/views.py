import datetime
import json
import os
import random

import requests
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login,logout

from .models import Song, Question

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())

@csrf_exempt
def new_view(request, *args, **kwargs):
    if request.method == 'POST':
        # if request.POST.get("token", "") == config["token"]:
        data=request.POST
        print(data)
        URL="https://www.googleapis.com/youtube/v3/search"
        song=data.get("artist","")+" - "+data.get("title","")
        PARAMS={
            "part":"snippet",
            "key": config.get("YTAPIKEY",""),
            "type":"video",
            "maxResults":1,
            "q":song
        }
        r=requests.get(url = URL, params = PARAMS)
        respons=r.json()
        print(respons)
        try:
            link='https://youtube.com/watch?v='+respons["items"][0]["id"]["videoId"]
            yttitle=respons["items"][0]["snippet"]["title"]
        except:
            link=""
            yttitle=""
        print(link)
        user=request.COOKIES.get("userid","XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")
        lastrecord=Song.objects.filter(createdAt__gte=timezone.now()-datetime.timedelta(seconds=15),user=user)
        if not lastrecord.exists():
            if not Song.objects.filter(link=link,played=False).exists():
                if not Song.objects.filter(link=link,played=True, playedAt__gte=timezone.now()-datetime.timedelta(minutes=1)).exists():
                    Song.objects.create(title=data.get("title"),artist=data.get("artist"),link=link,user=user,yttitle=yttitle)
                    return HttpResponse(status=201)
                else: #ha az utobbi egy hetben lett lejatszva
                    return HttpResponse("{\"played\": True}", status=422)
            else: #ha van meg le nem jatszott ilyen
                return HttpResponse("{\"played\":False}",status=422)
        else: #ha az utobbi 15 percben kuldott
            remaining = int((datetime.timedelta(minutes=15)-(timezone.now()-lastrecord.get().createdAt)).total_seconds())
            print(remaining)
            return HttpResponse(str(int(remaining/60))+":"+"{:02d}".format(remaining % 60), status=429)
        # else:
        #     return HttpResponse("INVALID TOKEN",status=403)
    else: # ha nem poston kuldott
        return HttpResponse(status=405)

@csrf_exempt
def played_view(request,*args,**kwargs):
    if request.method == 'POST':
        if request.POST.get("token", "") == config["token"]:
            id = request.POST.get("id", [""])
            print(id)
            object=Song.objects.filter(id=id)
            if object.exists():
                object.update(played=True,playedAt=datetime.datetime.now())
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=422)
        else:
            return HttpResponse("INVALID TOKEN",status=403)
    else:
        return HttpResponse(status=405)

@csrf_exempt
def delete_view(request,*args,**kwargs):
    if request.method == 'POST':
        if request.POST.get("token", "") == config["token"]:
            id=request.POST.get("id",[""])
            if id is "all":
                Song.objects.all().delete()
            else:
                id=int(id)
            print(id)
            object=Song.objects.filter(id=id)
            if object.exists():
                object.delete()
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=422)
        else:
            return HttpResponse("",status=403)
    else:
        return HttpResponse(status=405)


def list_view(request,*args,**kwargs):
    if request.method=='GET':
        mode = request.GET.get("mode",[""])
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
        elif mode=="thisuser":
            return jsonmodifier(serializers.serialize("json", Song.objects.filter(user=request.COOKIES.get("userid",""),played=False)))
        elif mode=="played":
            return jsonmodifier(serializers.serialize("json", Song.objects.filter(played=True)))
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


@csrf_exempt
def adminlogin_view(request, *args, **kwargs): 
    if request.method == 'POST':
        username = request.POST.get('username',"")
        password = request.POST.get('password',"")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request,user)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=403)
    else:
        return HttpResponse(status=405)

def adminlogout_view(request, *args, **kwargs):
    logout(request)
    return HttpResponse(status=200)

def question_view(request, *args, **kwargs):
    if request.method == 'GET':
        questions = Question.objects.all()
        id=random.randrange(len(questions))
        q = json.loads(serializers.serialize("json", Question.objects.get(id=id)))
        print(q)
        qjson=q[0]["fields"]
        qjson["id"]=id
        return HttpResponse(json.dumps(qjson), content_type="application/json", status=200)
    else:
        return HttpResponse(status=405)
