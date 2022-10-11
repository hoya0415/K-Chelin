from django.shortcuts import get_object_or_404, render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import BookmarkListSerializer, BookmarkSerializer
from .models import Bookmark
from stores.models import Store
from reviews.models import Review
from reviews.models import Hashtag
from stores.serializers import  StoreSerializer, StoreDetailSerializer
from django.db.models import Count

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



@api_view(['GET','POST'])
def bookmark_list_create(request):
    if request.method == 'GET':
        bookmarks = request.user.bookmark_set.all()
        serializer = BookmarkListSerializer(bookmarks, many=True)
        return Response(serializer.data)
    else:
        serializer = BookmarkListSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)

        bookmarks = request.user.bookmark_set.all()
        serializer = BookmarkListSerializer(bookmarks, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET','PUT','DELETE'])
def bookmark_update_delete(request, bookmark_pk):
    bookmark = get_object_or_404(Bookmark, pk=bookmark_pk)
    if not request.user.bookmark_set.filter(pk=bookmark_pk).exists():
        return Response({'detail':'권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        bookmark_store = bookmark.stores.all()
        serializer = StoreSerializer(bookmark_store,many=True)
        data = {
            "title" :bookmark.title,
            "stores" : custom_store_serializer(serializer.data)
        }
        return Response(data)

    if request.method == 'PUT':
        serializer = BookmarkListSerializer(bookmark, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
    else:
        bookmark.delete()
        
    bookmarks = request.user.bookmark_set.all()
    serializer = BookmarkListSerializer(bookmarks, many=True)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def bookmark_add(request, store_pk):
    if request.user.is_authenticated:
        store = get_object_or_404(Store, pk=store_pk)
        ids = request.data['id']
        for i in ids:
            bookmarks = request.user.bookmark_set.filter(stores=store_pk)
            if not request.user.bookmark_set.filter(pk=i).exists():
                return Response({'detail':'권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)

            if not store.bookmarks.filter(pk=i).exists():
                if not bookmarks:
                    store.store_cnt += 1
                    store.save()
                store.bookmarks.add(i)

        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def bookmark_del(request, bookmark_pk):
    if request.user.is_authenticated:
        bookmark = get_object_or_404(Bookmark, pk=bookmark_pk)
        if not request.user.bookmark_set.filter(pk=bookmark_pk).exists():
            return Response({'detail':'권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)

        ids = request.data['id']
        for i in ids:
            if bookmark.stores.filter(pk=i).exists():
                bookmark.stores.remove(i)
                bookmarks = request.user.bookmark_set.filter(stores=i)
                store = get_object_or_404(Store, pk=i)

                if not bookmarks:
                    store.store_cnt -= 1
                    store.save()
        serializer = BookmarkSerializer(bookmark)
        return Response(serializer.data)
    return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(["GET"])
def hashtag_similar(request):
    if request.user.is_authenticated:
        # 북마크가 있을 경우
        if request.user.bookmark_set.all():
            # 북마크에 있는 모든 스토어
            bookmarks = request.user.bookmark_set.values('stores')
            # 가장 해시태그
            topstores = Review.objects.filter(store_id__in=bookmarks).values('hashtags').annotate(Count('hashtags')).order_by('-hashtags__count')[0]
            # 가장 많은 해시태그의 그룹
            hashtag = Hashtag.objects.get(pk=topstores['hashtags']).group
            # 해당 그룹의 다른 멤버 해시태그
            tags = Hashtag.objects.filter(group=hashtag).values_list('id').order_by('?')[:4]

            similar_hashtag = []
            for tag in tags:
                similar_reviews = Review.objects.filter(hashtags__in=tag).order_by('?')[:8]
                similar_stores = Store.objects.filter(review__in=similar_reviews)
                serializer = StoreSerializer(similar_stores, many=True)
                tag = Hashtag.objects.get(id__in=tag).title
                data = {
                    "hashtag" : tag,
                    "stores":serializer.data
                }
                similar_hashtag.append(data)
           
            return Response(similar_hashtag)

        # 북마크가 없을 경우
        else:
            tags = Hashtag.objects.values_list('id').order_by('?')[:4]
            similar_hashtag = []
            for tag in tags:
                similar_reviews = Review.objects.filter(hashtags__in=tag).order_by('?')[:8]
                similar_stores = Store.objects.filter(review__in=similar_reviews)
                serializer = StoreSerializer(similar_stores, many=True)
                tag = Hashtag.objects.get(id__in=tag).title
                data = {
                    "hashtag" : tag,
                    "stores":serializer.data
                }
                similar_hashtag.append(data)
            return Response(similar_hashtag)
    return Response(status=status.HTTP_401_UNAUTHORIZED)


from mlxtend.frequent_patterns import association_rules
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori
import pandas as pd

@api_view(["POST"])
def create_recom_data(request): # DB에 생성된 모든 북마크 간 유사도 비교한 데이터 만들기(주기적으로 update해줘야함)
    bookmarks = Bookmark.objects.all()

    stores = []
    for bookmark in bookmarks:
        bm = []
        for store in bookmark.stores.all():
            bm.append(store.store_name)
        stores.append(bm)

    # 위 dataset을 True, False로 표시하고 dataframe으로 나타냄
    te = TransactionEncoder()
    te_result = te.fit(stores).transform(stores)
    df = pd.DataFrame(te_result, columns=te.columns_)
    # 데이터 프레임에서 각 itemset의 support를 구함
    # min_support이상의 support부터 나타남
    frequent = apriori(df, min_support=0.001, use_colnames=True)
    # 특정 개수 이상의 itemset만 추출
    frequent['length'] = frequent['itemsets'].apply(lambda x: len(x))
    freq1 = frequent[frequent['length'] <= 6]
    print(freq1)

    # 신뢰도 구하기
    # 최소 신뢰도가 0.8이상인 것만 추출
    rules = association_rules(freq1, metric='confidence', min_threshold=0.8)
    df = rules.sort_values(by=['lift'], ascending=False)
    df['antec_length'] = df['antecedents'].apply(lambda x: len(x))
    result = df.sort_values(by=['antec_length', 'lift'], ascending=False)

    def remove_set(string):
        new_string = ""
        for c in string:
            if c not in ["frozenset", '"', "(", ")", "{", "}", "'"]:
                new_string += c
        return new_string[9:]


    df.to_csv("recommendation.csv", index=False, encoding='utf-8-sig')
    doc = pd.read_csv('recommendation.csv')
    doc['antecedents'] = doc['antecedents'].apply(remove_set)
    doc['consequents'] = doc['consequents'].apply(remove_set)
    print(doc)
    doc.to_csv("recommendation_final.csv", index=False, encoding='utf-8-sig')
    return Response({'detail':'success'})

# bookmarks = Bookmark.objects.all()
# stores = []
# for bookmark in bookmarks:
#     bm = []
#     for store in bookmark.stores.all():
#         bm.append(store.store_name)
#     stores.append(bm)

# te = TransactionEncoder()
# te_result = te.fit(stores).transform(stores)
# df = pd.DataFrame(te_result, columns=te.columns_)
# print(df)
# # 데이터 프레임에서 각 itemset의 support를 구함
# # min_support이상의 support부터 나타남
# frequent = apriori(df, min_support=0.001, use_colnames=True)
# print(frequent)
# bookmark = get_object_or_404(Bookmark, pk=1)
# print(bookmark.stores.all())
# bookmark = get_object_or_404(Bookmark, pk=5)
# print(bookmark.stores.all())
# bookmark = get_object_or_404(Bookmark, pk=6)
# print(bookmark.stores.all())
# bookmark = get_object_or_404(Bookmark, pk=7)
# print(bookmark.stores.all())


from accounts.models import User
@api_view(["GET"])
def recommendation_lst(request):
    # user = get_object_or_404(User, pk=2)
    user = request.user
    user_bookmarks = user.bookmark_set.all()

    # 로그인한 유저가 북마크한 식당들
    user_store_lst = set()
    for bookmark in user_bookmarks:
        for store in bookmark.stores.all():
            user_store_lst.add(store.store_name)

    try:
        # 이미 북마크 사이 유사도가 분석되어 있는 데이터 가져옴 
        df = pd.read_csv('recommendation_final.csv')

        def str_to_set(stores):
            store_lst = set([store.strip() for store in stores.split(',')])
            return store_lst

        df['antecedents'] = df['antecedents'].apply(str_to_set)
        df['consequents'] = df['consequents'].apply(str_to_set)
    
        result = df[df['antecedents'] >= user_store_lst].sort_values(by=['antec_length', 'lift'], ascending=[False, False])
        recommend_stores = result['consequents']
    except:
        recommend_stores = []
    
    # 추천된 식당 담을 set(str으로 담김)
    recommend_result = set()
    for lst in recommend_stores:
        for store in lst:
            if len(recommend_result) == 6:  # 6개까지만 추천
                break
            if store not in user_store_lst:
                recommend_result.add(store)
    if recommend_result:
        # str으로 담긴 추천 식당을 queryset으로 담음
        store_detail = []
        for store in recommend_result:
            store_detail.append(get_object_or_404(Store, store_name=store))
        if len(recommend_result) == 10:
            # 추천 식당 serialize
            serializer = StoreSerializer(store_detail, many=True)
            storeList = custom_store_serializer(serializer.data)
        else: # 북마크 기반 추천을 6개 받지 못하면 나머지는 랜덤으로 받음
            recommend_stores = Store.objects.order_by('?')[:10-len(recommend_result)]
            store_detail += recommend_stores
            serializer = StoreSerializer(store_detail, many=True)
            storeList = custom_store_serializer(serializer.data)
    else:   # 사용자의 북마크가 없을 때
        recommend_stores = Store.objects.order_by('?')[:10]
        # print(recommend_stores)
        serializer = StoreSerializer(recommend_stores, many=True)
        storeList = custom_store_serializer(serializer.data)
    
    return Response(storeList)
