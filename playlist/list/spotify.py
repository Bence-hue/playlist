import json
import os

import requests
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from .models import Spoti

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())


def spotylogin_view(request, *args, **kwargs):
    if request.user.has_perm('spotilogin'):
        redirectUrl='https://accounts.spotify.com/en/authorize?client_id=83d5b03d29f64c7bba950c8f081b08ab&response_type=code&redirect_uri='+request.build_absolute_uri('/api/spotilogin/callback')+'&state='+config["spotistate"]
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
            print(r.json())
            return HttpResponse(status=200)
    return redirect("/")
