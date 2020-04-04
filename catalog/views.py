from django.shortcuts import render
from django.views import generic
from catalog.models import City, District, House, TrackingGadgetInstance

class TrackerListView(generic.ListView):
    model = TrackingGadgetInstance
    context_object_name = 'tracker_list'
    template_name = 'catalog/trackinggadgetinstance_list.html'
    
    def get_queryset(self):
	    return TrackingGadgetInstance.objects.all()
		
def trackerInstanceView(request, primary_key):
    try:
        tracker = TrackingGadgetInstance.objects.get(pk = primary_key)
    except TrackingGadgetInstance.DoesNotExist:
        raise Http404('Tracker does not exist')
		
    return render(request, 'catalog/trackinggadgetinstance.html', context = {'tracker': tracker})
		
def index(request):
    visitsCount = request.session.get('visitsCount', 1)
    request.session['visitsCount'] = visitsCount + 1
    num_cities = City.objects.all().count()
    num_districts = District.objects.count()
    num_districts_in_Izhevsk = District.objects.filter(city__name__exact = 'Ижевск').count()
    if visitsCount == 1:
        stringVisits = 'впервые'
    elif 2 <= visitsCount % 10 <= 4 and not (12 <= visitsCount <= 14):
        stringVisits = ' раза'
    else:
        stringVisits = ' раз'
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
        'visitsCount': visitsCount,
        'stringVisits': stringVisits,
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
	
def profile(request):

	context = {
	}
	
	return render(request, 'profile.html', context = context);
