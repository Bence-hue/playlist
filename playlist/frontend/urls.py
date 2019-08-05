from django.urls import path,include
from . import views

urlpatterns = [
    path("login",views.frontend_view),
    path("dashboard",views.admin_view)
]