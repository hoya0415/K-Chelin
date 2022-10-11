from django.shortcuts import get_list_or_404, get_object_or_404
from django.core.paginator import Paginator

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Store
from .serializers import  StoreSerializer, StoreDetailSerializer

from reviews.models import Review, Hashtag
from reviews.serializers import ReviewListSerializer, HashtagSerializer
from django.core.paginator import Paginator
from django.db.models import Count


import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random

# Create your views here.

def custom_store_serializer(infos):
    storeList = []
    for info in infos:
        store = get_object_or_404(Store, pk=info["id"])
        store_serializer = StoreDetailSerializer(store)
        imgs = []
        twitter_ids = []
        groups = set()
        for review in info["review_set"]:
            if len(imgs) < 2:
                imgs.append(review["img_url"])
            twitter_ids.append(review["twitter_id"])
            for hashtag in review["hashtags"]:
                for key, value in hashtag.items():
                    if key == "group" and value == "ETC":
                        groups.add(hashtag["singer"])
                    elif key == "group" and value != "ETC":
                        groups.add(value)
        data = {
                "store": StoreDetailSerializer(store).data,
                "imgs": imgs,
                "reviews": twitter_ids,
                "group": groups,
                }
        storeList.append(data)
    return storeList


@api_view(['GET'])
def store_list(request):
    try:
        filter_type = request.GET.get('filter_type')
        filter_list = request.GET.getlist('filter_list[]')
        sort_type = request.GET.get('sort_type')
        page = request.GET.get('page')
        # 필터링 안 걸었을 때
        if filter_type == 'all' : 
            stores = Store.objects.all().order_by('?')
        # 카테고리 기준으로 필터링
        elif filter_type == 'category':
            stores = Store.objects.filter(category__in=filter_list).order_by('?')
        # 아티스트 기준으로 필터링
        elif filter_type == 'artist':
            filter_tags = Hashtag.objects.filter(group__in=filter_list)
            filter_reviews = Review.objects.filter(hashtags__in=filter_tags)
            stores = Store.objects.filter(review__in=filter_reviews).order_by('?').distinct()
        # 지역 기준으로 필터링
        elif filter_type == 'region':
            stores = Store.objects.filter(simple_address__in=filter_list).order_by('?')
            
        # 정렬
        if sort_type == 'reviews_cnt':
            stores = stores.annotate(Count('review')).order_by('-review__count')
        elif sort_type == 'store_cnt':
            stores = stores.order_by('-store_cnt')
        elif sort_type == 'name_down':
            stores = stores.order_by('store_name')
        elif sort_type == 'name_up':
            stores = stores.order_by('-store_name')
        
        # 페이지네이션. 프론트에서 페이지네이션 안 하고 싶을 땐 ''을 보내줌
        if page == '':
            serializer = StoreSerializer(stores, many=True)
            storeList = custom_store_serializer(serializer.data)
            data = {'storeList': storeList, 'storeSize': 0}
        else:
            paginator = Paginator(stores, 10)
            store_list = paginator.get_page(page)
            serializer = StoreSerializer(store_list, many=True)
            storeList = custom_store_serializer(serializer.data)
            print(paginator.count)
            data = {'storeList': storeList, 'storeSize': paginator.count}
        return Response(data)
    except:
        return Response({'detail':'실패다!'})


@api_view(['GET'])
def store_detail(request, store_pk):
    store = get_object_or_404(Store, pk=store_pk)    
    serializer = StoreSerializer(store)
    store_serializer = StoreDetailSerializer(store)
    imgs = []
    twitter_ids = []
    groups = set()
    for review in serializer.data["review_set"]:
        if len(imgs) < 5:
            imgs.append(review["img_url"])
        twitter_ids.append(review["twitter_id"])
        for hashtag in review["hashtags"]:
            for key, value in hashtag.items():
                if key == "group" and value == "ETC":
                    groups.add(hashtag["singer"])
                elif key == "group" and value != "ETC":
                    groups.add(value)
    
    data = {
            "store": store_serializer.data,
            "imgs": imgs,
            "reviews": twitter_ids,
            "group": groups
            }

    return Response(data)



@api_view(['GET'])
def hashtag_list(request):
    hashtags = get_list_or_404(Hashtag)    
    serializer = HashtagSerializer(hashtags, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def hashtag_search(request, keyword):
    hashtags = Hashtag.objects.all().filter(singer__icontains=keyword) | Hashtag.objects.all().filter(title__icontains=keyword)
    serializer = HashtagSerializer(hashtags, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def similar(request, store_pk):
    store = Store.objects.get(pk=store_pk).map_id

    # 벡터화 및 코사인 유사도
    doc = pd.DataFrame(Store.objects.all().values())
    tfidf_vector = TfidfVectorizer()
    tfidf_matrix = tfidf_vector.fit_transform(doc['category']).toarray()
    tfidf_matrix_feature = tfidf_vector.get_feature_names_out()

    tfidf_matrix = pd.DataFrame(tfidf_matrix, columns=tfidf_matrix_feature, index = doc.map_id)
    cosine_sim = cosine_similarity(tfidf_matrix)
    cosine_sim_df = pd.DataFrame(cosine_sim, index = doc.map_id, columns = doc.map_id)

    def contents_recommendations(target_store, matrix, items, k=10):
        recom_idx = matrix.loc[:, target_store].values.reshape(1, -1).argsort()[:, ::-1].flatten()[1:k+2]
        recom_idx =  np.array(list(map(lambda x : x +1, recom_idx)))

        # 같은 가게는 제외
        res = recom_idx[items.iloc[recom_idx, :].map_id.values != target_store]

        # 랜덤으로 4개의 음식점만 추출
        res = random.sample(list(recom_idx), 4)
        result = Store.objects.filter(pk__in=res) 

        return result
    
    res = contents_recommendations(store, cosine_sim_df, doc,20)
    serializer = StoreSerializer(res, many=True)
    return Response(serializer.data)


import math
import random
@api_view(['GET'])
def nearby_list(request):
    # 현재 위치 좌표=받아오기
    lat1 = float(request.GET.get('lat'))
    lng1 = float(request.GET.get('lng'))
    dist = 1
    radius = 6371 # km
    stores = Store.objects.all()  
    # 목표 좌표를 구해서 현재 좌표와의 거리를 판단하고 최대거리 안에 있으면 True 반환하는 함수
    def is_near(store):
        lat2 = store.lat
        lng2 = store.lon
        dlat = math.radians(lat2-lat1) 
        dlng = math.radians(lng2-lng1)
        a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2) * math.sin(dlng/2) 
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a)) 
        d = radius * c
        if d < dist:
            return True
        else:
            return False
    nearby_stores = []
    # 리스트 갯수가 최소 10개 이상 나올 때까지 거리 늘려가면서 조회
    nearby_stores = list(filter(is_near, stores))
    if len(nearby_stores) <= 5: 
        while len(nearby_stores) <= 5:
            nearby_stores = list(filter(is_near, stores))
            dist += 5

    random.shuffle(nearby_stores) # 매번 똑같은 가게부터 나오면 재미없으니까 셔플 
    serializer = StoreSerializer(nearby_stores, many=True)

    storeList = custom_store_serializer(serializer.data)

    # 조건에 맞는 리스트와 리스트 길이 반환
    data = {'nearbyList': storeList, 'nearbyListSize': len(nearby_stores) }
    return Response(data)


@api_view(['GET'])
def search_result(request, type):
    page = request.GET.get('page')
    keyword = request.GET.get('keyword')
    if type == 1:
        # 가게 이름으로 검색한 결과
        stores = Store.objects.filter(store_name__icontains=keyword)

    elif type == 2:
        # 지역으로 검색한 결과
        stores = Store.objects.filter(address__icontains=keyword)

    elif type == 3:
        # 아티스트로 검색한 결과(가수, 그룹, 해시태그 셋 다 검색)
        hashtags = Hashtag.objects.filter(singer__icontains=keyword) | Hashtag.objects.filter(group__icontains=keyword) | Hashtag.objects.filter(title__icontains=keyword)
        stores = set()
        for hashtag in hashtags:
            hashtag_stores = hashtag.reviews.values_list('store', flat=True)
            for store in hashtag_stores:
                stores.add(get_object_or_404(Store, pk=store))
        stores = list(stores)
        
    if page == '':
        # print(stores)
        serializer = StoreSerializer(stores, many=True)
        # print(serializer.data)
        storeList = custom_store_serializer(serializer.data)
        # print(storeList)
        data = {'storeList': storeList, 'storeSize': ''}
    else:
        paginator = Paginator(stores, 10)
        store_list = paginator.get_page(page)
        serializer = StoreSerializer(store_list, many=True)
        storeList = custom_store_serializer(serializer.data)
        data = {'storeList': storeList, 'storeSize': paginator.count}
    return Response(data)
