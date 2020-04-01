from django.shortcuts import render
from catalog.models import City, District, House, TrackingGadgetInstance

def index(request):
    num_cities = City.objects.all().count()
    num_districts = District.objects.count()
    num_districts_in_Izhevsk = District.objects.filter(city__name__exact = 'Ижевск').count()
    if num_cities % 10 == 0 or num_cities % 10 >= 5 or 11 <= num_cities <= 14:
        string_cities = 'городов'
    elif num_cities % 10 == 1:
        string_cities = 'город'
    else:
        string_cities = 'города'
    if num_districts % 10 == 0 or num_districts % 10 >= 5 or 11 <= num_districts <= 14:
        string_districts = 'районов'
    elif num_districts % 10 == 1:
        string_districts = 'район'
    else:
        string_districts = 'района'
    if num_districts_in_Izhevsk % 10 == 0 or num_districts_in_Izhevsk % 10 >= 5 or 11 <= num_districts_in_Izhevsk <= 14:
        string_districts_in_Izhevsk = 'районов'
    elif num_districts_in_Izhevsk % 10 == 1:
        string_districts_in_Izhevsk = 'район'
    else:
        string_districts_in_Izhevsk = 'района'
    context = {
        'num_cities': num_cities,
        'string_cities': string_cities,
        'num_districts': num_districts,
		'string_districts': string_districts,
        'num_districts_in_Izhevsk': num_districts_in_Izhevsk,
		'string_districts_in_Izhevsk': string_districts_in_Izhevsk,
    }
	
    return render(request, 'index.html', context = context)
	
def about(request):

    context = {
    }
	
    return render(request, 'about.html', context = context)
	
def faq(request):

    context = {
    }
	
    return render(request, 'faq.html', context = context)
