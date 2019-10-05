import base64
import datetime
import json
import os

import requests
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

from .models import Spotiuser,Setting

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())



def login_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        if "playlist" in request.GET:
            redirectUrl='https://accounts.spotify.com/en/authorize?client_id=83d5b03d29f64c7bba950c8f081b08ab&response_type=code&redirect_uri='+request.build_absolute_uri('/api/spotify/callback')+'&state='+config["spotistate"]+"playlist&scope=playlist-modify-private playlist-modify"
            return redirect(redirectUrl)
        else:
            redirectUrl='https://accounts.spotify.com/en/authorize?client_id=83d5b03d29f64c7bba950c8f081b08ab&response_type=code&redirect_uri='+request.build_absolute_uri('/api/spotify/callback')+'&state='+config["spotistate"]+"&scope=user-modify-playback-state user-read-playback-state playlist-modify-private playlist-modify-public"
            return redirect(redirectUrl)
    else: raise PermissionDenied

@csrf_exempt
def callback_view(request, *args, **kwargs):
    if request.GET.get("state","")==config["spotistate"]+"playlist":
        if request.GET.get("code"):
            Spotiuser.objects.filter(isPlaylistController=True).delete()
            r=requests.post("https://accounts.spotify.com/api/token",{
                "grant_type":"authorization_code",
                "code":request.GET.get("code"),
                "redirect_uri":request.build_absolute_uri('/api/spotify/callback'),
                'client_id':"83d5b03d29f64c7bba950c8f081b08ab",
                'client_secret':config["spotisecret"]
            })
            rj=r.json()
            su=Spotiuser.objects.create(access_token=rj["access_token"],refresh_token=rj["refresh_token"],expiresAt=datetime.datetime.now()+datetime.timedelta(seconds=rj["expires_in"]),isPlaylistController=True,device='')
            su.save()
    elif request.GET.get("state","")==config["spotistate"]:
        Spotiuser.objects.filter(user=request.user).delete()
        r=requests.post("https://accounts.spotify.com/api/token",{
                "grant_type":"authorization_code",
                "code":request.GET.get("code"),
                "redirect_uri":request.build_absolute_uri('/api/spotify/callback'),
                'client_id':"83d5b03d29f64c7bba950c8f081b08ab",
                'client_secret':config["spotisecret"]
        })
        rj=r.json()
        su=Spotiuser.objects.create(user=request.user,access_token=rj["access_token"],refresh_token=rj["refresh_token"],expiresAt=datetime.datetime.now()+datetime.timedelta(seconds=rj["expires_in"]),device='')
        su.save()
        r=requests.put("https://api.spotify.com/v1/playlists/"+Setting.objects.get(name="playlist").value+"/followers",json.dumps({"public":False}),headers={"Authorization":"Bearer "+Spotiuser.objects.get(user=request.user).access_token,"Content-Type":"application/json"})
        print(r.text,r.status_code,r.content,r.url)
    return redirect("/admin/settings")

def checkexpiration(request=None):
    if request is None: playlist=True
    else: playlist=False
    try:
        if playlist:e=Spotiuser.objects.get(isPlaylistController=True).expiresAt
        else: e=Spotiuser.objects.get(user=request.user).expiresAt
        if e<timezone.now():
            if playlist:rt=Spotiuser.objects.get(isPlaylistController=True).refresh_token
            else: rt=Spotiuser.objects.get(user=request.user).refresh_token
            r=requests.post('https://accounts.spotify.com/api/token',{
                "grant_type":"refresh_token",
                "refresh_token":rt
            },headers={
                "Authorization":"Basic "+base64.b64encode(bytes("83d5b03d29f64c7bba950c8f081b08ab"+":"+config["spotisecret"],"ascii")).decode("ascii")
            })
            rj=r.json()
            if playlist: su=Spotiuser.objects.get(isPlaylistController=True)
            else: su=Spotiuser.objects.get(user=request.user)
            su.access_token=rj["access_token"]
            su.expiresAt=datetime.datetime.now()+datetime.timedelta(seconds=rj["expires_in"])
            su.save()
            return True
    except Exception as e: print(e)
    return False

def new(title):
    checkexpiration()
    r=requests.get("https://api.spotify.com/v1/search",{
        "q":title,
        "type":"track",
        "limit":1
    },headers={"Authorization":"Bearer "+Spotiuser.objects.get(isPlaylistController=True).access_token})
    respons=r.json()
    try:
        a=requests.post("https://api.spotify.com/v1/playlists/"+ Setting.objects.get(name="playlist").value
        +"/tracks",params={"uris":respons["tracks"]["items"][0]["uri"]},headers={"Authorization":"Bearer "+Spotiuser.objects.get(isPlaylistController=True).access_token})
        print(a.status_code,a.text,a.url)
        return (respons["tracks"]["items"][0]["artists"][0]["name"]+": "+respons["tracks"]["items"][0]["name"],respons["tracks"]["items"][0]["external_urls"]["spotify"],respons["tracks"]["items"][0]["uri"])
    except Exception as e:
        print(e)
        return ("","","")

def add(uri):
    if uri=="":return
    checkexpiration()
    r=requests.post("https://api.spotify.com/v1/playlists/"+ Setting.objects.get(name="playlist").value
    +"/tracks",params={"uris":uri},headers={"Authorization":"Bearer "+Spotiuser.objects.get(isPlaylistController=True).access_token})

def delete(uri):
    if uri=="":return
    checkexpiration()
    r=requests.delete("https://api.spotify.com/v1/playlists/"+ Setting.objects.get(name="playlist").value
    +"/tracks",headers={
        "Authorization":"Bearer "+Spotiuser.objects.get(isPlaylistController=True).access_token,
        "Content-Type":"application/json"
    },data=json.dumps({"tracks":[{"uri":uri}]}))

@csrf_exempt
def devices_view(request,*args,**kwargs):
    checkexpiration(request)
    if request.method=="GET":
        try:
            r=requests.get("https://api.spotify.com/v1/me/player/devices",headers={"Authorization":"Bearer "+Spotiuser.objects.get(user=request.user)   .access_token})
            devices=[]
            print(r.json())
            for d in r.json()["devices"]:
                print(d)
                devices.append({"id":d["id"],"name":d["name"],"type":d["type"],"isSelected":Spotiuser.objects.get(user=request.user).device==d["id"]})
            response={'isAnySelected':Spotiuser.objects.get(user=request.user).device!="",'devices':devices}
            return HttpResponse(json.dumps(response),content_type="application/json")
        except Exception as e: return HttpResponse(e,status=404)
    else:
        try:
            su=Spotiuser.objects.get(user=request.user)
            su.device=request.POST.get("id","")
            su.save()
            return HttpResponse(su.device,status=200)
        except Exception as e: return HttpResponse(e,status=404)

def play(request,uri):
    checkexpiration(request)
    r=requests.put("https://api.spotify.com/v1/me/player/shuffle?state=false",headers={"Authorization":"Bearer "+Spotiuser.objects.get(user=request.user).access_token})
    r.raise_for_status
    r=requests.get("https://api.spotify.com/v1/playlists/"+Setting.objects.get(name="playlist").value+"/tracks",headers={"Authorization":"Bearer "+Spotiuser.objects.get(user=request.user).access_token})
    if Spotiuser.objects.get(user=request.user).device=="" or Spotiuser.objects.get(user=request.user).device is None:
        url="https://api.spotify.com/v1/me/player/play"
    else:
        url="https://api.spotify.com/v1/me/player/play?device_id="+Spotiuser.objects.get(user=request.user).device
    if contains(r.json(),uri):
        r=requests.put(url,data=json.dumps({"context_uri":"spotify:playlist:"+Setting.objects.get(name="playlist").value,"offset":{"uri":uri}}),headers={"Authorization":"Bearer "+Spotiuser.objects.get(user=request.user).access_token})
    else:
        r=requests.put(url,data=json.dumps({"uris":[uri]}),headers={"Authorization":"Bearer "+Spotiuser.objects.get(user=request.user).access_token})
    print(r.content)
    r.raise_for_status
    return r.status_code==204

def contains(pl,uri):
    for l in pl["items"]:
        if l["track"]["uri"]==uri: return True
    return False

def status_view(request, *args, **kwargs):
    return HttpResponse(Spotiuser.objects.filter(user=request.user).exists())

def username_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        checkexpiration(request)
        r=requests.get("https://api.spotify.com/v1/me",headers={"Authorization":"Bearer "+Spotiuser.objects.get(user=request.user).access_token})
        return HttpResponse(r.json().get("display_name",""))
    else: raise PermissionDenied

def logout(request, *args, **kwargs):
    if request.user.is_authenticated:
        Spotiuser.objects.get(user=request.user).delete()
        return redirect('https://www.spotify.com/hu/account/apps/')
    else: raise PermissionDenied