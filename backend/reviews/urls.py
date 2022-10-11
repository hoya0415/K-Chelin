from django.urls import path
from . import views

urlpatterns = [
    path('hashtag/', views.hashtag),
    path('', views.review_list),
    path('<int:review_pk>/', views.review_detail),
    path('store/<int:store_pk>/', views.store_reviews),
]