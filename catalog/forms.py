from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User


class LoginForm(ModelForm):
	username = forms.CharField(label='login', max_length = 32)
	password = forms.CharField(label='password', min_length = 8, max_length = 128, widget=forms.PasswordInput)

	class Meta:
		model = User
		fields = ['username', 'password']