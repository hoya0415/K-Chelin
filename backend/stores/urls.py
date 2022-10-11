from django.urls import path
from . import views

urlpatterns = [
    path('', views.store_list),
    path('<int:store_pk>/', views.store_detail),
    path('hashtags/', views.hashtag_list),
    path('<int:store_pk>/similar/', views.similar),
    path('nearby/', views.nearby_list),
    path('search/<int:type>/', views.search_result),
    path('hashtag/<keyword>/', views.hashtag_search),

]
