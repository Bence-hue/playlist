import base64
import datetime
import json
import os
import uuid

from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from simplecrypt import decrypt
from django.core.exceptions import PermissionDenied

from list.models import Setting

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())

# Create your views here.
@ensure_csrf_cookie
def frontend_view(request, *args,**kwargs):
    if Setting.objects.get(name="maintenance").value==1:
        return redirect("/maintenance")
    else:
        print()
        if request.get_full_path()=="/new" and Setting.objects.get(name="canAskSong").value==0:
            return redirect("/?noNew=true")
        response = render(request, "index.html")
        if 'userid' not in request.COOKIES:
            userid = str(uuid.uuid4())
        else:
            userid=request.COOKIES["userid"]
        max_age = 52 * 7 * 24 * 60 * 60
        expires = datetime.datetime.strftime(datetime.datetime.now() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
        response.set_cookie('userid',userid , max_age=max_age, expires=expires)
        return response

def maintenance_view(request, *args,**kwargs):
    if Setting.objects.get(name="maintenance").value==1:
        return render(request, "index.html")
    else:
        return redirect("/")

def admin_view(request,*args,**kwargs):
    if request.user.is_authenticated:
        return render(request, "index.html")
    else:
        raise PermissionDenied

def login_view(request,*args,**kwargs):
    if request.user.is_authenticated:
        url=request.COOKIES.get("url","/admin/dashboard")
        print(url)
        if url == "/admin/":url="/admin/dashboard"
        respons=redirect(url)
        respons.delete_cookie("url")
        return respons
    else:
        if "login" in request.COOKIES:
            try:
                username,password=decrypt(config["SECRET_KEY"],base64.b64decode(request.COOKIES["login"])).decode("utf-8").split(";")
                user = authenticate(request, username=username, password=password)
                if user is not None:
                    login(request, user)
                    print("bycookie")
                    url=request.COOKIES.get("url","/admin/dashboard")
                    respons=redirect(url)
                    respons.delete_cookie("url")
                    return respons
                else:
                    respons=render(request, "index.html")
                    respons.delete_cookie("login")
                    return respons
            except:
                respons=render(request, "index.html")
                respons.delete_cookie("login")
                return respons
        else:
            return render(request, "index.html")

def e403(request,*args,**kwargs):
    respons=redirect('/admin/login')
    respons.set_cookie("url",request.get_full_path())
    return respons

def e404(request,*args,**kwargs):
    return redirect('/404')

def e500(request,*args,**kwargs):
    return redirect('/500')
