from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
	path('about/', views.about, name='about'),
	path('faq/', views.faq, name='faq'),
	path('profile/', views.profile, name='profile'),
	path('trackers/', views.TrackerListView.as_view(), name='trackers'),
	path('trackers/<int:primary_key>', views.trackerInstanceView, name='tracker-instance'),
]