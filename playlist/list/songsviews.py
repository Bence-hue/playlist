from .models import BlockedUser, Song, Setting,Log
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.shortcuts import redirect, render
import json
import os
import datetime
import uuid
import requests
from django.core import serializers
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from django.core.mail import EmailMessage

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())

# @csrf_exempt
def new_view(request, *args, **kwargs):
    if request.method == 'POST':
        if Setting.objects.get(name="canRequestSong").value==0: return HttpResponse(status=403)
        data = request.POST
        print(data)
        URL = "https://www.googleapis.com/youtube/v3/search"
        artistlist=data.get("artist", "").split(" ")
        titlelist=data.get("title", "").split(" ")
        artist=""
        title=""
        for ale in artistlist:
            if ale != "":
                artist+=ale+" "
        for tle in titlelist:
            if tle != "":
                title+=tle+" "
        artist = artist[:-1]
        title=title[:-1]
        song =  artist+ " - " + title
        PARAMS = {
            "part": "snippet",
            "key": config.get("YTAPIKEY1", ""),
            "type": "video",
            "maxResults": 1,
            "q": song
        }
        r = requests.get(url=URL, params=PARAMS)
        respons = r.json()
        # print(respons)
        try:
            link = 'https://youtube.com/watch?v=' + respons["items"][0]["id"]["videoId"]
            yttitle = respons["items"][0]["snippet"]["title"]
        except:
            PARAMS["key"] = config.get("YTAPIKEY2", "")
            r = requests.get(url=URL, params=PARAMS)
            respons = r.json()
            try:
                link = 'https://youtube.com/watch?v=' + respons["items"][0]["id"]["videoId"]
                yttitle = respons["items"][0]["snippet"]["title"]
            except:
                PARAMS["key"] = config.get("YTAPIKEY3", "")
                r = requests.get(url=URL, params=PARAMS)
                respons = r.json()
                try:
                    link = 'https://youtube.com/watch?v=' + respons["items"][0]["id"]["videoId"]
                    yttitle = respons["items"][0]["snippet"]["title"]
                except:
                    link = ""
                    yttitle = ""
        print(link)
        user = request.COOKIES.get("userid", uuid.uuid4())
        blocks = BlockedUser.objects.filter(userid=user)
        if not blocks.filter(permanent=True).exists():
            if not blocks.filter(expireAt__gte=timezone.now()).exists():
                lastrecord = Song.objects.filter(createdAt__gte=timezone.now() - datetime.timedelta(minutes=Setting.objects.get(name="songLimitMinute").value),user=user)
                if len(lastrecord) < Setting.objects.get(name="songLimitNumber").value:
                    if not Song.objects.filter(link=link, played=False).exclude(link="").exists():
                        if not Song.objects.filter(link=link, played=True,playedAt__gte=timezone.now() - datetime.timedelta(weeks=1)).exclude(link="").exists():
                            Song.objects.create(title=title, artist=artist, link=link,user=user, yttitle=yttitle)
                            return HttpResponse(status=201)
                        else:  # ha az utobbi egy hetben lett lejatszva
                            return HttpResponse("{\"played\": True}", status=422)
                    else:  # ha van meg le nem jatszott ilyen
                        return HttpResponse("{\"played\":False}", status=422)
                else:  # ha az utobbi 15 percben kuldott
                    remaining = int((datetime.timedelta(minutes=Setting.objects.get(name="songLimitMinute").value) - (timezone.now() - lastrecord[0].createdAt)).total_seconds())
                    print(remaining)
                    return HttpResponse(str(int(remaining / 60)) + ":" + "{:02d}".format(remaining % 60), status=429)
            else:  # ha blokkolva van idore
                ei = (blocks.filter(expireAt__gte=timezone.now())[len(blocks.filter(expireAt__gte=timezone.now())) - 1].expireAt - timezone.now()).days + 1
                if ei > 7:
                    if ei % 7 == 0:
                        return HttpResponse(str(int(ei / 7)) + " hétig", status=401)
                    else:
                        return HttpResponse(str(int(ei / 7)) + " hétig és " + str(ei % 7) + " napig", status=401)
                else:
                    return HttpResponse(str(ei) + " napig", status=401)
        else:  # ha blokkolva van az user orokre
            return HttpResponse(status=418)
    else:  # ha nem poston kuldott
        return HttpResponse(status=405)


# @csrf_exempt
def played_view(request, *args, **kwargs):
    if request.method == 'POST':
        if request.user.is_authenticated:
            id = request.POST.get("id", [""])
            print(id)
            object = Song.objects.filter(id=id)
            if object.exists():
                object.update(played=True, playedAt=datetime.datetime.now())
                Log.objects.create(user=request.user,title="played",content=object[0].artist+" - "+object[0].title+" (id: "+object[0].id+")")
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=422)
        else:
            raise PermissionDenied
    else:
        return HttpResponse(status=405)


# @csrf_exempt
def delete_view(request, *args, **kwargs):
    if request.method == 'POST':
        if request.user.is_authenticated:
            id = request.POST.get("id", [""])
            if id is "all":
                Song.objects.all().delete()
            else:
                id = int(id)
            print(id)
            object = Song.objects.filter(id=id)
            if object.exists():
                Log.objects.create(user=request.user,title="deleted",content=object[0].artist+" - "+object[0].title+" (id: "+object[0].id+")")
                object.delete()
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=422)
        else:
            raise PermissionDenied
    else:
        return HttpResponse(status=405)


def list_view(request, *args, **kwargs):
    if request.method == 'GET':
        mode = request.GET.get("mode", [""])
        if mode == "all":
            return jsonmodifier(serializers.serialize("json", Song.objects.filter(hide=False)))
        elif mode == "unplayed":
            return jsonmodifier(serializers.serialize("json", Song.objects.filter(hide=False, played=False)))
        elif mode == "latest":
            full = json.loads(serializers.serialize("json", Song.objects.filter(hide=False)))
            latestid = full[len(full) - 1]["pk"]
            latestobject = json.loads(serializers.serialize("json", Song.objects.filter(hide=False, id=latestid)))
            latestjson = latestobject[0]["fields"]
            latestjson["id"] = latestid
            return HttpResponse(json.dumps(latestjson), content_type="application/json", status=200)
        elif mode == "thisuser":
            return jsonmodifier(serializers.serialize("json", Song.objects.filter(hide=False,user=request.COOKIES.get("userid",""),played=False)))
        elif mode == "played":
            return jsonmodifier(serializers.serialize("json", Song.objects.filter(hide=False, played=True)))
        else:
            return HttpResponse(status=422)
    else:
        return HttpResponse(status=405)


def jsonmodifier(data):
    datajson = json.loads(data)
    newdata = []
    for i in datajson:
        newdict = i["fields"]
        newdict["id"] = i["pk"]
        newdata.append(newdict)
    return HttpResponse(json.dumps(newdata), content_type="application/json", status=200)

def email_view(request, *args, **kwargs):
    if request.method == 'POST':
        data = request.POST
        mail = EmailMessage(
            subject=data.get("name", "") + " (playlist feedback)",
            body=data.get("message", "message") + "\n-----------------------------------\neszköz: " + request.META[
                'HTTP_USER_AGENT'] + ", userid: " + request.COOKIES.get("userid", "nincs userid cookie"),
            from_email="support@jelszo.co",
            to=["support@jelszo.co"],
            reply_to=[data.get("email", "support@jelszo.co")]
        )
        mail.send()
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=405)