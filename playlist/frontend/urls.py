from django.urls import path,include
from . import views

urlpatterns = [
    path("login",views.login_view),
    path("dashboard",views.admin_view),
    path('songs',views.admin_view),
    path('users',views.admin_view),
    path('',views.e403),
    path('settings',views.admin_view),
    path('firebase-messaging-sw.js',views.svpn)
]