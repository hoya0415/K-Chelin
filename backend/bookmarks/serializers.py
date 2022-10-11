from rest_framework import serializers
from .models import Bookmark
from stores.serializers import StoreSerializer

class BookmarkListSerializer(serializers.ModelSerializer):
    stores = StoreSerializer(many=True, read_only=True)
    class Meta:
        model = Bookmark
        fields = ('id', 'title','stores',)


class BookmarkSerializer(serializers.ModelSerializer):
    stores = StoreSerializer(many=True, read_only=True)
    stroes_count = serializers.IntegerField(source='stores.count',read_only=True)
    class Meta:
        model = Bookmark
        fields = '__all__'
