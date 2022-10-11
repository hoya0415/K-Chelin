from email.policy import default
from rest_framework import serializers
from .models import Store
from reviews.serializers import ReviewListSerializer


class StoreSerializer(serializers.ModelSerializer):
    review_set = ReviewListSerializer(many=True, read_only=True)
    reviews_cnt = serializers.IntegerField(source='review_set.count', read_only=True)
    class Meta:
        model = Store
        fields = '__all__'


class StoreDetailSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Store
        fields = '__all__'