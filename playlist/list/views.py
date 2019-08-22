import datetime
import json
import os
import random
import uuid

import requests
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.core.mail import EmailMessage

from .models import Song, Question, BlockedUser, BlockedSong

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())


# @csrf_exempt
def new_view(request, *args, **kwargs):
    if request.method == 'POST':
        data = request.POST
        print(data)
        URL = "https://www.googleapis.com/youtube/v3/search"
        song = data.get("artist", "") + " - " + data.get("title", "")
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
                lastrecord = Song.objects.filter(createdAt__gte=timezone.now() - datetime.timedelta(minutes=15),user=user)
                if len(lastrecord) < 3:
                    if not Song.objects.filter(link=link, played=False).exclude(link="").exists():
                        if not Song.objects.filter(link=link, played=True,playedAt__gte=timezone.now() - datetime.timedelta(weeks=1)).exclude(link="").exists():
                            Song.objects.create(title=data.get("title"), artist=data.get("artist"), link=link,user=user, yttitle=yttitle)
                            return HttpResponse(status=201)
                        else:  # ha az utobbi egy hetben lett lejatszva
                            return HttpResponse("{\"played\": True}", status=422)
                    else:  # ha van meg le nem jatszott ilyen
                        return HttpResponse("{\"played\":False}", status=422)
                else:  # ha az utobbi 15 percben kuldott
                    remaining = int((datetime.timedelta(minutes=15) - (timezone.now() - lastrecord[0].createdAt)).total_seconds())
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
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=422)
        else:
            return HttpResponse("PERMISSION DENIED", status=403)
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
                object.delete()
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=422)
        else:
            return HttpResponse("PERMISSION DENIED", status=403)
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


@csrf_exempt
def adminlogin_view(request, *args, **kwargs):
    if request.method == 'POST':
        username = request.POST.get('username', "")
        password = request.POST.get('password', "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/admin/dashboard")
        else:
            return redirect("/admin/login?auth=false")
    else:
        return HttpResponse(status=405)


def adminlogout_view(request, *args, **kwargs):
    logout(request)
    return redirect("/")


def question_view(request, *args, **kwargs):
    if request.method == 'GET':
        questions = Question.objects.all()
        id = random.randrange(len(questions))
        q = json.loads(serializers.serialize("json", Question.objects.get(id=id)))
        print(q)
        qjson = q[0]["fields"]
        qjson["id"] = id
        return HttpResponse(json.dumps(qjson), content_type="application/json", status=200)
    else:
        return HttpResponse(status=405)


def email_view(request, *args, **kwargs):
    if request.method == 'POST':
        data = request.POST
        mail = EmailMessage(
            subject=data.get("name", "") + " (playlist feedback)",
            body=data.get("message", "message") + "\neszköz: " + request.META[
                'HTTP_USER_AGENT'] + ", userid: " + request.COOKIES.get("userid", ""),
            from_email="support@jelszo.co",
            to=["support@jelszo.co"],
            reply_to=[data.get("email", "support@jelszo.co")]
        )
        mail.send()
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=405)


# @csrf_exempt
def blockuser_view(request, *args, **kwargs):
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = request.POST
            if data.get("permanent", "true") == "true":
                BlockedUser.objects.create(userid=data.get("userid"), permanent=True)
            else:
                BlockedUser.objects.create(userid=data.get("userid"), permanent=False,expireAt=datetime.datetime.now() + datetime.timedelta(weeks=int(data.get("expirein", 1))))
            for l in Song.objects.filter(user=data.get("userid"), played=False, hide=False):
                l.hide = True
                l.save()
            return HttpResponse(status=201)
        else:
            return HttpResponse("PERMISSION DENIED", status=403)
    else:
        return HttpResponse(status=405)


def unblockuser_view(request, *args, **kwargs):
    if request.method == 'POST':
        if request.user.is_authenticated:
            print(request.POST.get("userid"))
            user = BlockedUser.objects.filter(userid=request.POST.get("userid", uuid.uuid4))
            p = user.filter(permanent=True)
            t = user.filter(permanent=False, expireAt__gte=timezone.now())
            if p.exists():
                for l in p:
                    l.permanent = False
                    l.expireAt = timezone.now()
                    print(l.expireAt)
                    l.save()
            if t.exists():
                for l in t:
                    l.expireAt = timezone.now()
                    print(l.expireAt)
                    l.save()
            for l in Song.objects.filter(user=request.POST.get("userid", uuid.uuid4), played=False, hide=True):
                l.hide = False
                l.save()
            return HttpResponse(status=200)
        else:
            return HttpResponse("PERMISSION DENIED", status=403)
    else:
        return HttpResponse(status=405)


def statistics_view(request, *args, **kwargs):
    if request.method == 'GET':
        if request.user.is_authenticated:
            days = int(request.GET.get("days", "7"))
            respons = {}
            respons["created"] = len(Song.objects.filter(createdAt__gte=timezone.now() - datetime.timedelta(days=days)))
            respons["played"] = len(Song.objects.filter(played=True, playedAt__gte=timezone.now() - datetime.timedelta(days=days)))
            respons["total"] = len(Song.objects.filter(hide=False, played=False))
            return HttpResponse(json.dumps(respons), content_type="application/json", status=200)
        else:
            return HttpResponse("PERMISSION DENIED", status=403)
    else:
        return HttpResponse(status=405)


def username_view(request, *args, **kwargs):
    if request.method == "GET":
        if request.user.is_authenticated:
            return HttpResponse(request.user.first_name)
        else:
            return HttpResponse("PERMISSION DENIED", status=403)
    else:
        return HttpResponse(status=405)


def users_view(request, *args, **kwargs):
    if request.method == "GET":
        if request.user.is_authenticated:
            if request.GET.get("mode", "normal") == "normal":
                respons = []
                db = Song.objects.all()
                for l in reversed(db):
                    if not user_isBlocked(l):
                        contains = False
                        for u in respons:
                            if u["userid"] == l.user:
                                contains = True
                                u["songs"].append({"id": l.id, "artist": l.artist, "title": l.title})
                                break
                        if contains: continue
                        respons.append({
                            "userid": l.user,
                            "songs": [{"id": l.id, "artist": l.artist, "title": l.title}]
                        })
                return HttpResponse(json.dumps(respons), content_type="application/json", status=200)
            elif request.GET.get("mode", "normal") == "blocked":
                respons = []
                db = BlockedUser.objects.all()
                for i,l in enumerate(reversed(db)):
                    respons.append({"userid":l.userid,"block":user_blockedFor(l),"songs":{}})
                    for s in reversed(Song.objects.filter(user=l.userid)):
                        respons[i]["songs"].append({"id":s.id,"artist":l.artist,"title":s.title})
                return HttpResponse(json.dumps(respons), content_type="application/json", status=200)
        else:
            return HttpResponse("PERMISSION DENIED", status=403)

    else:
        return HttpResponse(status=405)


def user_isBlocked(l):
    try:
        blocks = BlockedUser.objects.filter(userid=l.user)
        if blocks.filter(permanent=True).exists():
            return True
        elif blocks.filter(permanent=False, expireAt__gte=timezone.now()).exists():
            return True
        return False
    except:
        return False


def user_blockedFor(l):
    if l.permanent==True:
        return {"isPerma": True}
    elif l.permanent==False and l.expireAt>=timezone.now():
        return {"isPerma": False, "ExpireIn": (blocks.filter(expireAt__gte=timezone.now())[len(
            l.expireAt - timezone.now()).days + 1}
