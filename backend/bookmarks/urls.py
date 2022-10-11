from django.urls import path
from . import views

urlpatterns = [
    path('', views.bookmark_list_create),
    path('<int:bookmark_pk>/', views.bookmark_update_delete),
    path('add/store/<int:store_pk>/', views.bookmark_add),
    path('del/store/<int:bookmark_pk>/', views.bookmark_del),
    path('hashtag/similar/', views.hashtag_similar),
    path('recommendation/', views.recommendation_lst),
    path('create/recommendation/data/', views.create_recom_data),
]