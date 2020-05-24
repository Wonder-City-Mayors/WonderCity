from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseForbidden
from django.db import connections

def authenticateByEmail(email, password):
	try:
		user = User.objects.get(email=email)
		if user.check_password(password):
			return user
	except User.DoesNotExist:
		return False
	return False

def profileView(request, login):
	from django.http import Http404
	try:
		userOnPage = User.objects.get(username = login)
	except User.DoesNotExist:
		raise Http404('User does not exist')

	return render(request, 'profile.html', context = {'userOnPage': userOnPage})

def changeUsername(request):
	if request.method == 'POST':
		if request.user.is_authenticated:
			if (request.user.username == request.POST['username']):
				return HttpResponseForbidden('Это и есть Ваш логин.')
			try:
				user = User.objects.get(username=request.POST['username'])
				return HttpResponseForbidden('Данный логин занят.')
			except User.DoesNotExist:
				user = request.user
				user.username = request.POST['username']
				user.save()
				return HttpResponse('OK')
		else:
			return HttpResponseForbidden()
	else:
		return HttpResponseForbidden()

def changePassword(request):
	if request.method == 'POST':
		if request.user.is_authenticated:
			if request.user.check_password(request.POST['old-password']):
				request.user.set_password(request.POST['new-password'])
				request.user.save()
				return HttpResponse('OK')
			else:
				return HttpResponseForbidden('Старый пароль неверен.')
		else:
			return HttpResponseForbidden()
	else:
		return HttpResponseForbidden()

def addTracker(request):
	if request.method == 'POST':
		if request.user.is_authenticated:
			with connections['lorawan'].cursor() as cursor:
				cursor.execute("SELECT id, user_id FROM tree WHERE id = %s AND parent <> '#'", [request.POST['id']])
				modem = cursor.fetchone()
				if (modem):
					if modem[1] is None:
						cursor.execute("UPDATE tree SET user_id = %s WHERE id = %s", [request.user.id, request.POST['id']])
						return HttpResponse('OK')
					else:
						return HttpResponseForbidden('Считывающее устройство с таким идентификатором уже зарегистрировано.')
				else:
					return HttpResponseForbidden('Считывающего устройства с таким идентификатором не существует.')
		else:
			print('Not authenticated')
			return HttpResponseForbidden()
	else:
		print('Not post')
		return HttpResponseForbidden()

def authorization(request):
    context = {}
    return render(request, 'profile.html', context = context)
		
def HeaderPage(request, requestPath, id = None):
	from django.contrib.auth import logout
	if request.method == 'GET':
		context = {}
		if requestPath == '':
			pageFileName = 'index.html'
			if request.user.is_authenticated:
				with connections['lorawan'].cursor() as cursor:
					cursor.execute("SELECT COUNT(*) FROM tree WHERE user_id = %s", [request.user.id])
					maxPage = cursor.fetchone()[0]
					if maxPage != 0:
						maxPage = maxPage // 10 + 1
						try:
							requestedPage = int(request.GET.get('page', 1))
						except ValueError:
							requestedPage = 1
						if requestedPage < 1 or requestedPage > maxPage:
							requestedPage = 1
						cursor.execute("SELECT * FROM tree WHERE user_id = %s ORDER BY ID ASC LIMIT %s, 10", [request.user.id, (requestedPage - 1) * 10])
						rawTree = cursor.fetchall()
						tree = []
						for stick in rawTree:
							stick = [stick[0], stick[3], stick[4]]
							cursor.execute(f'SELECT `energy_A` FROM `values_t1` WHERE `tree_id` = {stick[0]} ORDER BY `time_stamp_db` DESC LIMIT 1')
							newStick = cursor.fetchone()
							if newStick:
								stick.append(newStick[0])
							tree.append(stick)
						context['hasModems'] = True
						context['tree'] = tree
						context['requestedPage'] = requestedPage
						context['maxPage'] = maxPage
						if maxPage < 11:
							context['alotofmodems'] = False
							context['range'] = range(1, maxPage + 1)
						else:
							context['alotofmodems'] = True
							if requestedPage <= 5:
								context['range'] = range(2, 11)
							elif requestedPage + 5 > maxPage:
								context['range'] = range(maxPage - 9, maxPage)
							else:
								context['range'] = range(requestedPage - 4, requestedPage + 5)
					else:
						context['hasModems'] = False
		elif requestPath == 'logout':
			if request.user.is_authenticated:
				logout(request)
				return render(request, 'authorization/logout.html', {'loggedout': True})
			else:
				return render(request, 'authorization/logout.html', {'loggedout': False})
		else:
			pageFileName = requestPath + '.html'
		
		return render(request, pageFileName, context = context)

def authorizationPage(request):
	from django.contrib.auth import login
	if request.method == 'GET':
		return render(request, 'authorization/index.html')
	else:
		title = request.POST.get('title', False)
		if title:
			if title == 'logUserIn':
				email = request.POST['email']
				password = request.POST['password']
				user = User.objects.get(email=email)
				if user:
					if user.check_password(password):
						login(request, user)
						return HttpResponse()
					else:
						return HttpResponseForbidden('Неверный адрес или пароль.')
				else:
					return HttpResponseForbidden('Неверный адрес или пароль.')

			elif title == 'signUserUp':
				email = request.POST['email']
				try:
					user = User.objects.get(email = email)
					return HttpResponseForbidden('Данный email уже зарегистрирован.')
				except User.DoesNotExist:
					from django.core.mail import send_mail
					name = request.POST['name']
					surname = request.POST.get('surname', False)
					password = User.objects.make_random_password(length=16)
					send_mail('Ваш пароль в сервисе WonderCity', password, 'academy.wondercity@gmail.com', [email],
						fail_silently=False,
						html_message='Ваш пароль:<p style="font-weight: 700; font-size: 1.5rem">' +
						password + '<p>Используйте его вместе с вашей электронной почтой для входа.')
					user = User.objects.create_user('', email, password)
					user.first_name = name
					if surname:
						user.last_name = surname
					user.save()
					user.username = user.id
					user.save()
					return HttpResponse('success');