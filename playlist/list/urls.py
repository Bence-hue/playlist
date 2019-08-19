from django.urls import path,include
from . import views

urlpatterns=[
    path('new/',views.new_view,name='new'),
    path('played/',views.played_view,name="played"),
    path('delete/',views.delete_view,name="delete"),
    path('list/',views.list_view,name='list'),
    path('login/',views.adminlogin_view,name="login"),
    path('logout/', views.adminlogout_view, name="logout"),
    path('question/',views.question_view,name="question"),
    path('feedback/',views.email_view,name="mail"),
    path('blockuser/',views.blockuser_view,name="blockuser")
]
