from django.db import models
from stores.models import Store

# Create your models here.
class Hashtag(models.Model):
    title = models.CharField(max_length=200)
    singer = models.CharField(max_length=50, blank=True)
    group = models.CharField(max_length=50, blank=True)    
    cnt = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.pk}: {self.title}"


class Review(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    # twitter_id = models.IntegerField()
    twitter_id = models.CharField(max_length=25)
    map_id = models.IntegerField()
    url = models.CharField(max_length=200)
    img_url = models.CharField(max_length=200)
    hashtags = models.ManyToManyField(Hashtag, related_name='reviews')
    
    def __str__(self):
        return f"{self.pk}: {self.store}"
