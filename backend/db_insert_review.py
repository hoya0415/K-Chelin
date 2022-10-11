import csv
import os 
import django 

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings") 
django.setup() 

from reviews.models import Review
from stores.models import Store
from reviews.models import Hashtag
import requests
# backend 폴더에 넣고 하는것을 권장 / 바로 윗줄 모델 [from ~ import ~] 만 수정하기

# 넣을 csv파일의 경로 / 파일 우클릭해서 경로 복사 권장
CSV_PATH = '../data/review_fianl.csv' 

with open(CSV_PATH, "r", encoding="utf-8", newline='') as csvfile: 
    data_reader = csv.DictReader(csvfile) 
    cnt = 0
    for row in data_reader:
        if row['res_id']: # 식당 컬럼 비어있지 않으면
            cnt += 1
            url_lst = row['url'].split('/')
            twitter_id = url_lst[-1]
            store_id = int(float(row['res_id']))
            
            try: # review의 store_id가 Store DB에 있으면
                store = Store.objects.get(map_id=store_id)
                url = row['media/0/media_url']
                res = requests.get(url)
                if res.status_code != 200:
                    url = ""

                # review 인스턴스 만들고
                review = Review.objects.create( 
                    twitter_id = twitter_id,
                    map_id = store_id, 
                    url = row['url'], 
                    img_url = url, 
                    store = store,
                )

                # 해시태그 확인해서 
                for i in range(10):
                    hashtag = row[f'hashtags/{i}']
                    try: # 리뷰 해시태그가 해시태그 테이블에 있으면
                        tag = Hashtag.objects.get(title=hashtag)
                        # 태그 cnt + 1
                        tag.cnt += 1
                        tag.save()
                        # 위 review 인스턴스 hashtags에 추가
                        review.hashtags.add(tag)

                    except:
                        pass
            except:
                pass

# url = "http://pbs.twimg.com/media/FHXahpaaIAkvoIx.jpg"
# url = "http://pbs.twimg.com/media/FHTFE5RakAEeJvn.jpg"
# res = requests.get(url)
# if res.status_code != 200:
#     url = ""
# print(url)