from django.urls import path,include
from . import views

urlpatterns = [
    path("login",views.login_view),
    path("dashboard",views.admin_view),
    path('songs',views.admin_view),
    path('users',views.admin_view),
]