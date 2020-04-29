import json
from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.views import generic
from django.contrib.auth import authenticate, login, models
from catalog.models import City, District, House#, Modems
from catalog.forms import SignUpForm
from django.db import connections

def profileView(request, login):
    try:
        userOnPage = models.User.objects.get(username = login)
    except User.DoesNotExist:
        raise Http404('User does not exist')

    return render(request, 'profile.html', context = {'userOnPage': userOnPage})

def authorization(request):
    context = {}
    return render(request, 'profile.html', context = context)
		
def HeaderPage(request, requestPath, id = None):
	if request.method == 'POST':
		postTitle = request.POST.get('title', None)
		if postTitle == 'signIn':
			username = request.POST['username']
			password = request.POST['password']
			signin = authenticate(request, username=username, password=password)
			if signin is not None:
				login(request, signin)
				return HttpResponse('success')
			else:
				return HttpResponse('unsuccess')
				
		elif postTitle == 'signUpEmail':
			email = request.POST['email']
			try:
				user = models.User.objects.get(email=email)
			except models.User.DoesNotExist:
				return HttpResponse('success')
			return HttpResponse('unsuccess\nЭтот электронный адрес уже зарегистрирован')
			
		elif postTitle == 'signUpUsername':
			username = request.POST['username']
			try:
				user = models.User.objects.get(username=username)
			except models.User.DoesNotExist:
				return HttpResponse('success')
			return HttpResponse('unsuccess\nЭтот логин уже занят')
			
		elif postTitle == 'signUp':
			form = SignUpForm(request.POST)
			if form.is_valid:
				username = request.POST['username']
				password = request.POST['password']
				email = request.POST['email']
				first_name = request.POST['firstname']
				last_name = request.POST['lastname']
				new_user = models.User.objects.create_user(username=username, email=email, password=password)
				new_user.is_active = True
				new_user.first_name = first_name
				new_user.last_name = last_name
				new_user.save()
				login(request, new_user)
				return HttpResponse('success')
			return HttpResponse('Form is invalid!')

	elif request.method == 'GET':
		if requestPath == '':
			pageFileName = 'index.html'
			with connections['lorawan'].cursor() as cursor:
				cursor.execute("SELECT COUNT(*) FROM `tree` WHERE `parent` <> '#'")
				maxPage = cursor.fetchone()[0] // 10 + 1
				try:
					requestedPage = int(request.GET.get('page', 1))
				except ValueError:
					requestedPage = 1
				if requestedPage < 1 or requestedPage > maxPage:
					requestedPage = 1
				cursor.execute(f"SELECT * FROM `tree` WHERE `parent` <> '#' ORDER BY ID ASC LIMIT {(requestedPage - 1) * 10}, 10")
				rawTree = cursor.fetchall()
				tree = []
				for stick in rawTree:
					stick = [stick[0], stick[3], stick[4]]
					cursor.execute(f'SELECT `energy_A` FROM `values_t1` WHERE `tree_id` = {stick[0]} ORDER BY `time_stamp_db` DESC LIMIT 1')
					newStick = cursor.fetchone()
					if newStick:
						stick.append(newStick[0])
					tree.append(stick)
			context = {
				'tree': tree,
				'requestedPage': requestedPage,
				'maxPage': maxPage,
			}
			if requestedPage <= 5:
				context['paginationType'] = 'start'
				context['firstRange'] = range(1, requestedPage)
				context['lastRange'] = range(requestedPage + 1, 11)
			elif requestedPage > maxPage - 5:
				context['paginationType'] = 'end'
				context['firstRange'] = range(maxPage - 8, requestedPage)
				context['lastRange'] = range(requestedPage + 1, maxPage + 1)
			else:
				context['paginationType'] = 'middle'
				context['firstRange'] = range(requestedPage - 4, requestedPage)
				context['lastRange'] = range(requestedPage + 1, requestedPage + 5)
				
		else:
			pageFileName = requestPath + '.html'
			context = {
			}
		
		return render(request, pageFileName, context = context)
