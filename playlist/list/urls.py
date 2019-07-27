from django.urls import path,include
from . import views

urlpatterns=[
    path('new/',views.new_view,name='new'),
    path('played/',views.played_view,name="played")
]
