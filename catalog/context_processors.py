import json
from catalog.forms import SignInForm, SignUpForm
from django.http import HttpResponse
from django.contrib.auth import authenticate, login

def overall_variables(request):
	return {
		'signInForm': SignInForm(),
		'signUpform': SignUpForm(),
	}