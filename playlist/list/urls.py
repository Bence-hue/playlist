from django.urls import path,include
from . import songsviews,adminviews,spotify

spoti=[
    path('login',spotify.login_view),
    path('callback',spotify.callback_view),
    path('devices',spotify.devices_view),
    path('status',spotify.status_view),
    path('username',spotify.username_view)
]

urlpatterns=[
    path('new/',songsviews.new_view,name='new'),
    path('played/',songsviews.played_view,name="played"),
    path('play/',songsviews.play_view),
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
    path('sentry/',adminviews.sentry_view),
    path('spotify/',include(spoti))
]
