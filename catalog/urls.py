from django.urls import path, re_path, include
from . import views

urlpatterns = [
	path('', views.HeaderPage, {'requestPath': ''}, name='index'),
	path('about/', views.HeaderPage, {'requestPath': 'about'}, name='about'),
	path('faq/', views.HeaderPage, {'requestPath': 'faq'}, name='faq'),
	re_path(r'^profile/(?P<login>\w+)$', views.profileView, name='profile'),
]