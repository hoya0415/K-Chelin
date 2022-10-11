from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from stores.models import Store
from .models import Hashtag, Review
from .serializers import HashtagSerializer, ReviewSerializer, ReviewListSerializer

# Create your views here.
@api_view(['GET'])
def hashtag(request):
    hashtags = Hashtag.objects.all()
    serializer = HashtagSerializer(hashtags, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def review_list(request):
    reviews = Review.objects.all()
    serializer = ReviewListSerializer(reviews, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def review_detail(request, review_pk):
    review = get_object_or_404(Review, pk=review_pk)
    serializer = ReviewSerializer(review)
    return Response(serializer.data)


@api_view(['GET'])
def store_reviews(request, store_pk):
    store = get_object_or_404(Store, pk=store_pk)
    reviews = store.review_set
    serializer = ReviewListSerializer(reviews, many=True)
    return Response(serializer.data)
