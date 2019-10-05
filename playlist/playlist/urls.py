"""playlist URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from frontend import views
from django.conf.urls import (
    handler403, handler404, handler500
)

handler403= 'frontend.views.e403'
handler404 = 'frontend.views.e404'
handler500 = 'frontend.views.e500'

urlpatterns = [
    path('djadmin/', admin.site.urls),
    path('api/',include('list.urls')),
    path('',views.frontend_view),
    path('songs', views.frontend_view),
    path('new',views.frontend_view),
    path('cookies',views.frontend_view),
    path('about', views.frontend_view),
    path('admin/',include('frontend.urls')),
    path('404',views.frontend_view),
    path('500',views.frontend_view),
    path('maintenance', views.maintenance_view),
    path('firebase-messaging-sw.js',views.svpn)
]
