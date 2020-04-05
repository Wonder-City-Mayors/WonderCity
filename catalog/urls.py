from django.urls import path, re_path, include
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('about/', views.about, name='about'),
	path('faq/', views.faq, name='faq'),
	path('authorization/', views.authorization, name='authorization'),
	path('authorization/', include('django.contrib.auth.urls')),
	re_path(r'^profile/(?P<login>\w+)$', views.profileView, name='profile'),
	path('trackers/', views.TrackerListView.as_view(), name='trackers'),
	re_path(r'^trackers/(?P<id>\d+)$', views.trackerInstanceView, name='tracker-instance'),
]