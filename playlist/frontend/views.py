from django.shortcuts import render, redirect
from django.http import HttpResponse
import uuid
import datetime
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect

# Create your views here.
@ensure_csrf_cookie
@csrf_protect
def frontend_view(request, *args,**kwargs):
    response = render(request, "index.html")
    if 'userid' not in request.COOKIES:
        userid = str(uuid.uuid4())
    else:
        userid=request.COOKIES["userid"]
    max_age = 12 * 7 * 24 * 60 * 60
    expires = datetime.datetime.strftime(datetime.datetime.now() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie('userid',userid , max_age=max_age, expires=expires)
    return response


@csrf_protect
def admin_view(request,*args,**kwargs):
    if request.user.is_authenticated:
        return render(request, "index.html")
    else:
        return redirect("/login")
