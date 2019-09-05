import base64
import datetime
import uuid
import os
import json

from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from simplecrypt import decrypt, encrypt
from django.contrib.auth import authenticate, login

with open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datas.json"), "r") as cffile:
    config = json.loads(cffile.readline())

# Create your views here.
@ensure_csrf_cookie
def frontend_view(request, *args,**kwargs):
    response = render(request, "index.html")
    if 'userid' not in request.COOKIES:
        userid = str(uuid.uuid4())
    else:
        userid=request.COOKIES["userid"]
    max_age = 52 * 7 * 24 * 60 * 60
    expires = datetime.datetime.strftime(datetime.datetime.now() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie('userid',userid , max_age=max_age, expires=expires)
    return response

def admin_view(request,*args,**kwargs):
    if request.user.is_authenticated:
        return render(request, "index.html")
    else:
        return redirect("/admin/login")

def login_view(request,*args,**kwargs):
    if request.COOKIES["login"]:
        username,password=decrypt(cffile["SECRET_KEY"],base64.b64decode(request.COOKIES["login"])).decode('utf8').split(";")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse("fasza")
    else:
        if request.user.is_authenticated:
            return redirect("/admin/dashboard")
        else:
            return render(request, "index.html")

def e403(request,*args,**kwargs):
    return redirect('/admin/login')

def e404(request,*args,**kwargs):
    return redirect('/404')

def e500(request,*args,**kwargs):
    return redirect('/500')
