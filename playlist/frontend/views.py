from django.shortcuts import render
from django.http import HttpResponse
import uuid
import datetime

# Create your views here.
def index_view(request, *args,**kwargs):
    response=HttpResponse('valami')
    if 'userid' not in request.COOKIES:
        max_age = 4 * 365 * 24 * 60 * 60
        expires = datetime.datetime.strftime(datetime.datetime.now() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
        response.set_cookie('userid', str(uuid.uuid4()), max_age=max_age, expires=expires)
    return response
