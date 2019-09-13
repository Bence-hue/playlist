import json
import os

import requests
import datetime
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from .models import Spoti
import base64

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())


def spotylogin_view(request, *args, **kwargs):
    if request.user.has_perm('spotilogin'):
        redirectUrl='https://accounts.spotify.com/en/authorize?client_id=83d5b03d29f64c7bba950c8f081b08ab&response_type=code&redirect_uri='+request.build_absolute_uri('/api/spotilogin/callback')+'&state='+config["spotistate"]+"&scope=playlist-modify-private "
        return redirect(redirectUrl)
    else: raise PermissionDenied

@csrf_exempt
def spotylogincallback_view(request, *args, **kwargs):
    if request.GET.get("state","")==config["spotistate"]:
        if request.GET.get("code"):
            r=requests.post("https://accounts.spotify.com/api/token",{
                "grant_type":"authorization_code",
                "code":request.GET.get("code"),
                "redirect_uri":request.build_absolute_uri('/api/spotilogin/callback'),
                'client_id':"83d5b03d29f64c7bba950c8f081b08ab",
                'client_secret':config["spotisecret"]
            })
            rj=r.json()
            print(rj)
            at,c=Spoti.objects.get_or_create(key='access_token')
            at.value=rj["access_token"]
            at.save()
            rt,c=Spoti.objects.get_or_create(key='refresh_token')
            rt.value=rj["refresh_token"]
            rt.save()
            ea,c=Spoti.objects.get_or_create(key='expires_at')
            ea.value=datetime.datetime.now()+datetime.timedelta(seconds=rj["expires_in"])
            ea.save()
            return HttpResponse(status=200)
    return redirect("/")

def checkexpiration():
    re=Spoti.objects.get(key='expires_at').value
    e=datetime.datetime.strptime(re,"%Y-%m-%d %H:%M:%S.%f")
    print(e)
    if e<datetime.datetime.now():
        r=requests.post('https://accounts.spotify.com/api/token',{
            "grant_type":"refresh_token",
            "refresh_token":Spoti.objects.get(key='refresh_token').value
        },headers={
            "Authorization":"Basic "+base64.b64encode(bytes("83d5b03d29f64c7bba950c8f081b08ab:"+config["spotisecret"],"ascii")).decode("ascii")
        })
        rj=r.json()
        print(rj)
        at,c=Spoti.objects.get_or_create(key='access_token')
        at.value=rj["access_token"]
        at.save()
        ea,c=Spoti.objects.get_or_create(key='expires_at')
        ea.value=datetime.datetime.now()+datetime.timedelta(seconds=rj["expires_in"])
        ea.save()
        return True
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
        a=requests.post("https://api.spotify.com/v1/playlists/2zNpxy6agd3jRPzEVovt5t/tracks",params={"uris":respons["tracks"]["items"][0]["uri"]},headers={"Authorization":"Bearer "+Spoti.objects.get(key="access_token").value})
        print(a.status_code,a.text,a.url)
        return (respons["tracks"]["items"][0]["artists"][0]["name"]+": "+respons["tracks"]["items"][0]["name"],respons["tracks"]["items"][0]["external_urls"]["spotify"],respons["tracks"]["items"][0]["uri"])
    except Exception as e:
        print(e)
        return ("","","")

def add(uri):
    if uri=="":return
    checkexpiration()
    r=requests.post("https://api.spotify.com/v1/playlists/2zNpxy6agd3jRPzEVovt5t/tracks",params={"uris":uri},headers={"Authorization":"Bearer "+Spoti.objects.get(key="access_token").value})

def delete(uri):
    if uri=="":return
    checkexpiration()
    r=requests.delete("https://api.spotify.com/v1/playlists/2zNpxy6agd3jRPzEVovt5t/tracks",headers={
        "Authorization":"Bearer "+Spoti.objects.get(key="access_token").value,
        "Content-Type":"application/json"
    },data=json.dumps({"tracks":[{"uri":uri}]}))