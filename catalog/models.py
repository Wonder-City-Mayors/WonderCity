from django.db import models

class City(models.Model):
    # Fields
    name = models.CharField(max_length = 20, primary_key = True, verbose_name = "Название")
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
    name = models.CharField(max_length = 20, verbose_name = "Название")
    id = models.AutoField(primary_key = True)
    city = models.ForeignKey(City, on_delete = models.CASCADE, verbose_name = "Город")
    # Metadata
    class Meta: 
        ordering = ['id']
    # Methods
    def get_absolute_url(self):
        return reverse('model-detail-view', args=[str(self.id)])
    
    def __str__(self):
        return f'{self.id} ({self.name} район, {self.city.name})'
		
class House(models.Model):
    # Fields
    address = models.TextField(verbose_name = "Адрес")
    id = models.AutoField(primary_key = True)
    district = models.ForeignKey(District, null = True, on_delete = models.SET_NULL, verbose_name = "Район")
    # Metadata
    class Meta: 
        ordering = ['id']
    # Methods
    def get_absolute_url(self):
        return reverse('model-detail-view', args=[str(self.id)])
    
    def __str__(self):
        return f'{self.id} ({self.address}, {self.district.name} район, {self.district.city.name})'
		
class TrackingGadgetInstance(models.Model):
    # Fields
    TYPE_CHOICES = (
        ('электричество', 'Электрический'),
        ('вода', 'Водный'),
        ('газ', 'Газовый'),
    )
    manufacturer = models.CharField(max_length = 20, verbose_name = "Производитель")
    type = models.CharField(max_length = 13, choices = TYPE_CHOICES, verbose_name = "Тип", default = None)
    readings = models.IntegerField(verbose_name = "Показания")
    id = models.AutoField(primary_key = True)
    house = models.ForeignKey(House, on_delete = models.CASCADE, verbose_name = "Дом")
    # Metadata
    class Meta: 
        ordering = ['id']
    # Methods
    def get_absolute_url(self):
        return reverse('model-detail-view', args=[str(self.id)])
    
    def __str__(self):
        return f'{self.id} | {self.readings} | ({self.manufacturer} {self.type}, {self.house.address}, {self.house.district.name} район, {self.house.district.city.name})'

print("Welcome, Kimp13. Or should I call you master?")




