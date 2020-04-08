import json
from catalog.forms import LoginForm
from django.http import HttpResponse
from django.contrib.auth import authenticate, login

def overall_variables(request):
	return {
		'formLogin': LoginForm(),
	}