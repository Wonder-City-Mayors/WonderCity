from django.db import models
from django.urls import reverse
	
class Modems(models.Model):
  sn_m = models.IntegerField()
  name = models.TextField()
  state = models.IntegerField()
  dt = models.DateTimeField()

  class Meta:
      db_table = 'modems'
	
  def get_absolute_url(self):
      return reverse('model-detail-view', args=[str(self.id)])
  
  def __str__(self):
      return self.name
		

class Tree(models.Model):
  curr_id = models.TextField()
  parent = models.TextField()
  text = models.TextField()
  type = models.IntegerField()
  sn_c = models.IntegerField()
  sn_m = models.TextField()

  class Meta:
      db_table = 'tree'
	
  def get_absolute_url(self):
      return reverse('model-detail-view', args=[str(self.id)])
  
  def __str__(self):
      return self.name

class Types(models.Model):
  name = models.TextField()

  class Meta:
      db_table = 'types'
	
  def get_absolute_url(self):
      return reverse('model-detail-view', args=[str(self.id)])
  
  def __str__(self):
      return self.name
		


class ValuesT1(models.Model):
  tree_id = models.IntegerField()
  time_stamp_db = models.DateTimeField()
  sn_m = models.IntegerField()
  sn_c = models.IntegerField()
  type = models.IntegerField()
  error = models.TextField()
  addr = models.IntegerField()
  power = models.FloatField()
  power_Q = models.FloatField(db_column='power_Q')  # Field name made lowercase.
  power_S = models.FloatField(db_column='power_S')  # Field name made lowercase.
  energy = models.FloatField()
  energy_A = models.FloatField(db_column='energy_A')  # Field name made lowercase.
  energy_R = models.FloatField(db_column='energy_R')  # Field name made lowercase.
  u = models.FloatField()
  i = models.FloatField()
  freq = models.FloatField()
  cos = models.FloatField()
  time_stamp = models.TextField()

  class Meta:
      db_table = 'values_t1'
	
  def get_absolute_url(self):
      return reverse('model-detail-view', args=[str(self.id)])
  
  def __str__(self):
      return self.name