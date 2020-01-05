import base64
import datetime
import json
import os
import uuid
import jwt

from django.contrib.auth import authenticate, login
from django.http import HttpResponse, FileResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied

from list.models import Setting

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())

# Create your views here.
@ensure_csrf_cookie
def frontend_view(request, *args, **kwargs):
    if int(Setting.objects.get(name="maintenance").value) == 1:
        return redirect("/maintenance")
    else:
        print()
        if request.get_full_path() == "/new" and int(Setting.objects.get(name="canRequestSong").value) == 0:
            return redirect("/?noNew=true")
        response = render(request, "index.html")
        if 'userid' not in request.COOKIES:
            userid = str(uuid.uuid4())
        else:
            userid = request.COOKIES["userid"]
        max_age = 52 * 7 * 24 * 60 * 60
        expires = datetime.datetime.strftime(datetime.datetime.now(
        ) + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
        response.set_cookie('userid', userid, max_age=max_age, expires=expires)
        return response


def maintenance_view(request, *args, **kwargs):
    if int(Setting.objects.get(name="maintenance").value) == 1:
        return render(request, "index.html")
    else:
        return redirect("/")


def admin_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        return render(request, "index.html")
    else:
        raise PermissionDenied


def login_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        url = request.COOKIES.get("url", "/admin/dashboard")
        print(url)
        if url == "/admin/":
            url = "/admin/dashboard"
        response = redirect(url)
        response.delete_cookie("url")
        return response
    else:
        if "login" in request.COOKIES:
            try:
                payload=jwt.decode(request.COOKIES["login"][2:-1],config["SECRET_KEY"])
                print(payload)
                user=User.objects.get(id=payload["id"],username=payload["username"])
                if user is not None:
                    login(request, user)
                    url = request.COOKIES.get("url", "/admin/dashboard")
                    response = redirect(url)
                    response.delete_cookie("url")
                    return response
                else:
                    response = render(request, "index.html")
                    response.delete_cookie("login")
                    return response
            except:
                response = render(request, "index.html")
                response.delete_cookie("login")
                return response
        else:
            return render(request, "index.html")


def e403(request, *args, **kwargs):
    respons = redirect('/admin/login')
    respons.set_cookie("url", request.get_full_path())
    return respons


def e404(request, *args, **kwargs):
    return redirect('/404')


def e500(request, *args, **kwargs):
    return redirect('/500')


def svpn(request, *args, **kwargs):
    return FileResponse(open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static/firebase-messaging-sw.js"), "rb"))
