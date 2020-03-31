from django.db import models

class City(models.Model):
    # Fields
    name = models.CharField(max_length = 20, primary_key = True)
    # Metadata
    class Meta: 
        ordering = ['name']

    # Methods
    def get_absolute_url(self):
        return reverse('model-detail-view', args=[str(self.id)])
    
    def __str__(self):
        return self.name
		
class District(models.Model):
    # Fields
    name = models.CharField(max_length = 20)
    id = models.AutoField(primary_key = True)
    city = models.ForeignKey(City, on_delete = models.CASCADE)
    # Metadata
    class Meta: 
        ordering = ['id']
    # Methods
    def get_absolute_url(self):
        return reverse('model-detail-view', args=[str(self.id)])
    
    def __str__(self):
        return f'{self.id} ({self.name}, in {self.city.name})'
		
class House(models.Model):
    # Fields
    address = models.TextField()
    id = models.AutoField(primary_key = True)
    district = models.ForeignKey(District, null = True, on_delete = models.SET_NULL)
    # Metadata
    class Meta: 
        ordering = ['id']
    # Methods
    def get_absolute_url(self):
        return reverse('model-detail-view', args=[str(self.id)])
    
    def __str__(self):
        return self.name
		
class TrackingGadgetInstance(models.Model):
    # Fields
    manufacturer = models.CharField(max_length = 20)
    model = models.TextField()
    readings = models.TextField()
    id = models.AutoField(primary_key = True)
    house = models.ForeignKey(House, on_delete = models.CASCADE)
    # Metadata
    class Meta: 
        ordering = ['id']
    # Methods
    def get_absolute_url(self):
        return reverse('model-detail-view', args=[str(self.id)])
    
    def __str__(self):
        return self.name

cities = {}
cities["Izhevsk"] = City(name = "Izhevsk")
cities["Izhevsk"].save()
districts = [
	District(name = "Oktyabrskiy", city = cities["Izhevsk"]),
	District(name = "Industrialniy", city = cities["Izhevsk"]),
	]
for i in range(len(districts)):
	districts[i].save()
	print(f'{districts[i].id} ({districts[i].name}, in {districts[i].city.name})')
"""housesTable = [
	House(address = "", district = 1)
	House(address = "", district = 1)
	House(address = "", district = 2)
	House(address = "", district = 2)
	]"""
	




