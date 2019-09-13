import base64
import json
import os
import datetime
import uuid
import requests

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core import serializers
from django.core.exceptions import PermissionDenied
from django.utils import timezone
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from simplecrypt import encrypt

from .models import BlockedUser, Log, Setting, Song

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())

@csrf_exempt
def adminlogin_view(request, *args, **kwargs):
    if request.method == 'POST':
        print(request.META["HTTP_REFERER"])
        remember=bool(request.POST.get('remember', False))
        username = request.POST.get('username', "")
        password = request.POST.get('password', "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            url=request.COOKIES.get("url","/admin/dashboard")
            respons=redirect(url)
            respons.delete_cookie("url")
            if remember:
                print("cookieset")
                respons.set_cookie("login",base64.b64encode(encrypt(config["SECRET_KEY"],username+";"+password)).decode(),60*60*24*30)
            return respons
        else:
            return redirect("/admin/login?badauth=true")
    else:
        return HttpResponse(status=405)


def adminlogout_view(request, *args, **kwargs):
    logout(request)
    respons=redirect("/")
    respons.delete_cookie("login")
    return respons

# @csrf_exempt
def blockuser_view(request, *args, **kwargs):
    if request.method == 'POST':
        if request.user.has_perm('list.can_ban'):
            data = request.POST
            if data.get("permanent", "true") == "true":
                BlockedUser.objects.create(userid=data.get("userid"), permanent=True)
                Log.objects.create(user=request.user,title="ban",content=json.dumps({
                    "userid":data.get("userid"),
                    "status":"permanent"}))
            else:
                BlockedUser.objects.create(userid=data.get("userid"), permanent=False,expireAt=datetime.datetime.now() + datetime.timedelta(weeks=int(data.get("expirein", 1))))
                Log.objects.create(user=request.user,title="ban",content=json.dumps({
                    "userid":data.get("userid"),
                    "status":"{} hétre".format(data.get("expirein", 1))}))
            for l in Song.objects.filter(user=data.get("userid"), played=False, hide=False):
                l.hide = True
                l.save()
            return HttpResponse(status=201)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponse(status=405)


def unblockuser_view(request, *args, **kwargs):
    if request.method == 'POST':
        if request.user.has_perm('list.can_ban'):
            print(request.POST.get("userid"))
            user = BlockedUser.objects.filter(userid=request.POST.get("userid", uuid.uuid4))
            p = user.filter(permanent=True)
            t = user.filter(permanent=False, expireAt__gte=timezone.now())
            if p.exists():
                for l in p:
                    l.permanent = False
                    l.expireAt = timezone.now()-datetime.timedelta(minutes=1)
                    print(l.expireAt)
                    l.save()
            if t.exists():
                for l in t:
                    l.expireAt = timezone.now()-datetime.timedelta(minutes=1)
                    print(l.expireAt)
                    l.save()
            for l in Song.objects.filter(user=request.POST.get("userid", uuid.uuid4), played=False, hide=True):
                l.hide = False
                l.save()
                Log.objects.create(user=request.user,title="unban",content=request.POST.get("userid"))
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
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
            raise PermissionDenied
    else:
        return HttpResponse(status=405)


def username_view(request, *args, **kwargs):
    if request.method == "GET":
        if request.user.is_authenticated:
            return HttpResponse(request.user.first_name)
        else:
            raise PermissionDenied
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
                db = BlockedUser.objects.filter(Q(permanent=True)|Q(permanent=False,expireAt__gte=timezone.now()))
                for i,l in enumerate(reversed(db)):
                    respons.append({"userid":str(l.userid),"block":user_blockedFor(l),"songs":[]})
                    for s in reversed(Song.objects.filter(user=l.userid)):
                        respons[i]["songs"].append({"id":s.id,"artist":s.artist,"title":s.title})
                return HttpResponse(json.dumps(respons), content_type="application/json", status=200)
        else:
            raise PermissionDenied

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
    else:
        return {"isPerma": False, "ExpireIn": (l.expireAt - timezone.now()).days + 1}

@csrf_exempt
def settings_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        if request.method=='POST':
            if request.user.has_perm("list.can_modify_settings"):
                s=kwargs["s"]
                if s=="maintenance":
                    setting=Setting.objects.get(name="maintenance")
                    setting.value=int(request.POST.get("value","false")=="true")
                    setting.save()
                    if request.POST.get("value","false")=="true":
                        Log.objects.create(user=request.user,title="modify",content="Maintenance mód bekapcsolva")
                    else:
                        Log.objects.create(user=request.user,title="modify",content="Maintenance mód kikapcsolva")
                    return HttpResponse(Setting.objects.get(name="maintenance").value==1)
                elif s=="canrequestsong":
                    setting=Setting.objects.get(name="canRequestSong")
                    setting.value=int(request.POST.get("value","true")=="true")
                    setting.save()
                    if request.POST.get("value","true")=="true":
                        Log.objects.create(user=request.user,title="modify",content="Lehet számot kérni")
                    else:
                        Log.objects.create(user=request.user,title="modify",content="Nem lehet számot kérni")
                    return HttpResponse(Setting.objects.get(name="canRequestSong").value==1)
                elif s=="songlimit":
                    number=request.POST.get("number",Setting.objects.get(name="songLimitNumber").value)
                    minute=request.POST.get("minute",Setting.objects.get(name="songLimitMinute").value)
                    n=Setting.objects.get(name="songLimitNumber")
                    n.value=number
                    n.save()
                    m=Setting.objects.get(name="songLimitMinute")
                    m.value=minute
                    m.save()
                    minute=request.POST.get("minute",Setting.objects.get(name="songLimitMinute").value)
                    minute=request.POST.get("minute",Setting.objects.get(name="songLimitMinute").value)
                    Log.objects.create(user=request.user,title="modify",content="Új limit: {}, {} percenként".format(request.POST.get("number",Setting.objects.get(name="songLimitNumber").value),request.POST.get("minute",Setting.objects.get(name="songLimitMinute").value)))
                    r={
                        "number":Setting.objects.get(name="songLimitNumber").value,
                        "minute":Setting.objects.get(name="songLimitMinute").value
                    }
                    return HttpResponse(json.dumps(r))
                else:
                    return HttpResponse(status=422)
            else:
                return HttpResponse(status=401)
        else:
            settings=Setting.objects
            s={
                "maintenance":settings.get(name="maintenance").value==1,
                "canRequestSong":settings.get(name="canRequestSong").value==1,
                "songLimitNumber":settings.get(name="songLimitNumber").value,
                "songLimitMinute":settings.get(name="songLimitMinute").value
            }
            return HttpResponse(json.dumps(s))
    else:
        raise PermissionDenied

def log_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        if request.method=='GET':
            lograw=Log.objects.all()
            log=[]
            for l in reversed(lograw):
                log.append({"type":l.title,"content":l.content,"name":l.user.get_username()+" ("+l.user.get_full_name()+")","time":gettime(l.time)})
            return HttpResponse(json.dumps(log),content_type="application/json")
        else: 
            return HttpResponse(status=405)
    else:
        raise PermissionDenied

def gettime(dt):
    td=timezone.now()-dt
    if td <= datetime.timedelta(minutes=1):
        return "Épp most"
    elif td <= datetime.timedelta(hours=1):
        return "{} perce".format(td.seconds//60)
    elif td <= datetime.timedelta(days=1):
        return "{} órája".format(td.seconds//3600)
    elif td <= datetime.timedelta(days=7):
        return "{} napja".format(td.days)
    elif td <= datetime.timedelta(weeks=4):
        return "{} hete".format(td.days//7)
    else: dt.strftime("%Y.%m.%d")

def sentry_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        r=requests.get(url="https://sentry.io/api/0/projects/jelszo-co/playlist-frontend/issues/",headers={"Authorization":"Bearer "+config["sentryapi"]})
        return HttpResponse(len(r.json()))
    else:
        raise PermissionDenied