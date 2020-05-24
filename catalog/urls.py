from django.urls import path, re_path, include
from . import views

urlpatterns = [
	path('', views.HeaderPage, {'requestPath': ''}, name='index'),
	path('about/', views.HeaderPage, {'requestPath': 'about'}, name='about'),
	path('faq/', views.HeaderPage, {'requestPath': 'faq'}, name='faq'),
	path('authorization/logout', views.HeaderPage, {'requestPath': 'logout'}, name='logout'),
	path('authorization/', views.authorizationPage, name='auth'),
	path('profile-management/change-username', views.changeUsername, name='change-username'),
	path('profile-management/change-password', views.changePassword, name='change-password'),
	path('profile-management/add-tracker', views.addTracker, name='add-tracker'),
	re_path(r'^profile/(?P<login>\w+)$', views.profileView, name='profile'),
]