from rest_framework import serializers
from .models import Review, Hashtag

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    hashtags = HashtagSerializer(many=True, read_only=True)
    class Meta:
        model = Review
        fields = '__all__'


class ReviewListSerializer(serializers.ModelSerializer):
    hashtags = HashtagSerializer(many=True, read_only=True)
    class Meta:
        model = Review
        fields = ('id', 'twitter_id', 'img_url', 'hashtags')
        

