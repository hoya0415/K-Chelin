from django.db import models
from django.conf import settings
from stores.models import Store

# Create your models here.
class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    stores = models.ManyToManyField(Store, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.pk}: {self.title}"
