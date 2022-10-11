import csv
import os 
import django 

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings") 
django.setup() 

from reviews.models import Review
from stores.models import Store

reviews = Review.objects.filter(twitter_id=1289202127538016257)
print(reviews)

stores = Store.objects.filter(map_id=1103092572)
print(stores)