from django.db import models

# Create your models here.

class Store(models.Model):
    map_id = models.IntegerField()
    store_name = models.CharField(max_length=50)
    address = models.CharField(max_length=200)
    simple_address = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    tel = models.CharField(max_length=50)
    business_hours = models.CharField(max_length=500)
    store_cnt = models.IntegerField(default=0)
    lat = models.FloatField()
    lon = models.FloatField()

    def __str__(self):
        return f"{self.pk}: {self.store_name}/ {self.simple_address}"