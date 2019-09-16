import base64
import datetime
import json
import os

import requests
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

from .models import Spotiuser,Setting

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())


def spotylogin_view(request, *args, **kwargs):
    if request.user.is_authenticated and not Spotiuser.objects.filter(user=request.user).exists():
        if "playlist" in request.GET:
            redirectUrl='https://accounts.spotify.com/en/authorize?client_id=83d5b03d29f64c7bba950c8f081b08ab&response_type=code&redirect_uri='+request.build_absolute_uri('/api/spotilogin/callback')+'&state='+config["spotistate"]+"playlist&scope=playlist-modify-private playlist-modify"
            return redirect(redirectUrl)
        else:
            redirectUrl='https://accounts.spotify.com/en/authorize?client_id=83d5b03d29f64c7bba950c8f081b08ab&response_type=code&redirect_uri='+request.build_absolute_uri('/api/spotilogin/callback')+'&state='+config["spotistate"]+"&scope=user-modify-playback-state user-read-playback-state user-follow-modify"
            return redirect(redirectUrl)
    else: return redirect("/admin/settings")

@csrf_exempt
def spotylogincallback_view(request, *args, **kwargs):
    if request.GET.get("state","")==config["spotistate"]+"playlist":
        if request.GET.get("code"):
            Spotiuser.objects.filter(isPlaylistController=True).delete()
            r=requests.post("https://accounts.spotify.com/api/token",{
                "grant_type":"authorization_code",
                "code":request.GET.get("code"),
                "redirect_uri":request.build_absolute_uri('/api/spotilogin/callback'),
                'client_id':"83d5b03d29f64c7bba950c8f081b08ab",
                'client_secret':config["spotisecret"]
            })
            rj=r.json()
            su=Spotiuser.objects.create(access_token=rj["access_token"],refresh_token=rj["refresh_token"],expiresAt=datetime.datetime.now()+datetime.timedelta(seconds=rj["expires_in"]),isPlaylistController=True)
            su.save()
    elif request.GET.get("state","")==config["spotistate"]:
        Spotiuser.objects.filter(user=request.user).delete()
        r=requests.post("https://accounts.spotify.com/api/token",{
                "grant_type":"authorization_code",
                "code":request.GET.get("code"),
                "redirect_uri":request.build_absolute_uri('/api/spotilogin/callback'),
                'client_id':"83d5b03d29f64c7bba950c8f081b08ab",
                'client_secret':config["spotisecret"]
        })
        rj=r.json()
        su=Spotiuser.objects.create(user=request.user,access_token=rj["access_token"],refresh_token=rj["refresh_token"],expiresAt=datetime.datetime.now()+datetime.timedelta(seconds=rj["expires_in"]))
        su.save()
    return redirect("/admin/settings")

def checkexpiration(request,playlist=True):
    try:
        if playlist:e=Spotiuser.objects.get(isPlaylistController=True).value
        else: e=Spotiuser.objects.get(user=request.user).value
        if e<datetime.datetime.now():
            if playlist:rt=Spotiuser.objects.get(isPlaylistController=True).value
            else: rt=Spotiuser.objects.get(user=request.user).value
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
    except: pass
    return False

def new(title):
    checkexpiration()
    r=requests.get("https://api.spotify.com/v1/search",{
        "q":title,
        "type":"track",
        "limit":1
    },headers={"Authorization":"Bearer "+Spoti.objects.get(key="access_token").value})
    respons=r.json()
    try:
        a=requests.post("https://api.spotify.com/v1/playlists/"+Spoti.objects.get(key="playlist").value+"/tracks",params={"uris":respons["tracks"]["items"][0]["uri"]},headers={"Authorization":"Bearer "+Spoti.objects.get(key="access_token").value})
        print(a.status_code,a.text,a.url)
        return (respons["tracks"]["items"][0]["artists"][0]["name"]+": "+respons["tracks"]["items"][0]["name"],respons["tracks"]["items"][0]["external_urls"]["spotify"],respons["tracks"]["items"][0]["uri"])
    except Exception as e:
        print(e)
        return ("","","")

def add(uri):
    if uri=="":return
    checkexpiration()
    r=requests.post("https://api.spotify.com/v1/playlists/"+Spoti.objects.get(key="playlist").value+"/tracks",params={"uris":uri},headers={"Authorization":"Bearer "+Spoti.objects.get(key="access_token").value})

def delete(uri):
    if uri=="":return
    checkexpiration()
    r=requests.delete("https://api.spotify.com/v1/playlists/"+Spoti.objects.get(key="playlist").value+"/tracks",headers={
        "Authorization":"Bearer "+Spoti.objects.get(key="access_token").value,
        "Content-Type":"application/json"
    },data=json.dumps({"tracks":[{"uri":uri}]}))
