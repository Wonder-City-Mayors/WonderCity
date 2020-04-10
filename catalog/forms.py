from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User


class SignInForm(ModelForm):
	username = forms.CharField(label='Login', max_length = 32)
	password = forms.CharField(label='Password', min_length = 8, max_length = 128, widget=forms.PasswordInput)

	class Meta:
		model = User
		fields = ['username', 'password']
		
class SignUpForm(ModelForm):
	firstname = forms.CharField(label='First Name', max_length = 32)
	lastname = forms.CharField(label='Last Name', max_length = 128)
	email = forms.EmailField(label='Email', max_length = 256)
	username = forms.CharField(label='Login', max_length = 32)
	password = forms.CharField(label='Password', min_length = 8, max_length = 128, widget=forms.PasswordInput)
	passwordConfirmation = forms.CharField(label='Password', min_length = 8, max_length = 128, widget=forms.PasswordInput)
	class Meta:
		model = User
		fields = ['firstname', 'lastname', 'email', 'username', 'password', 'passwordConfirmation']
	