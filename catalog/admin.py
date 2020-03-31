from django.contrib import admin
from .models import City, District, House, TrackingGadgetInstance

# INLINES
class TrackingGadgetInstanceInline(admin.TabularInline):
	model = TrackingGadgetInstance

# ADMINS
class HouseAdmin(admin.ModelAdmin):
	inlines = [TrackingGadgetInstanceInline]

class TrackingGadgetInstanceAdmin(admin.ModelAdmin):
	list_display = ('type', 'manufacturer', 'readings')
	list_filter = ('type', 'manufacturer', 'readings')
	fieldsets = (
		(None, {
			'fields': ('manufacturer', 'house')
		}),
		('Показания', {
			'fields': ('type', 'readings')
		}),
	)
	
# REGISTRATION
admin.site.register(City)
admin.site.register(District)
admin.site.register(House, HouseAdmin)
admin.site.register(TrackingGadgetInstance, TrackingGadgetInstanceAdmin)
