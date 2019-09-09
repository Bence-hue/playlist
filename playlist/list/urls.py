from django.urls import path,include
from . import songsviews,adminviews

urlpatterns=[
    path('new/',songsviews.new_view,name='new'),
    path('played/',songsviews.played_view,name="played"),
    path('delete/',songsviews.delete_view,name="delete"),
    path('list/',songsviews.list_view,name='list'),
    path('login/',adminviews.adminlogin_view,name="login"),
    path('logout/', adminviews.adminlogout_view, name="logout"),
    path('feedback/',songsviews.email_view,name="mail"),
    path('blockuser/',adminviews.blockuser_view,name="blockuser"),
    path('username/',adminviews.username_view,name="username"),
    path('statistics/',adminviews.statistics_view,name="statistics"),
    path('users/',adminviews.users_view,name="users"),
    path('unblock/',adminviews.unblockuser_view,name="unblock"),
    path('settings/',adminviews.settings_view,name="settings"),
    path('settings/<s>/',adminviews.settings_view,name="settings"),
    path('log/',adminviews.log_view,name="log"),
    path('sentry/',adminviews.sentry_view)
]
