from django.shortcuts import render
from catalog.models import City, District, House, TrackingGadgetInstance

def index(request):
    num_cities = City.objects.all().count()
    num_districts = District.objects.count()
    num_districts_in_Izhevsk = District.objects.filter(city__name__exact = 'Ижевск').count()

    context = {
        'num_cities': num_cities,
        'num_districts': num_districts,
        'num_districts_in_Izhevsk': num_districts_in_Izhevsk,
    }
	
    return render(request, 'index.html', context = context)
