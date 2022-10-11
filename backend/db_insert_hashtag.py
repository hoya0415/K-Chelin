import csv
import os 
import django 

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings") 
django.setup() 

from reviews.models import Hashtag
# backend 폴더에 넣고 하는것을 권장 / 바로 윗줄 모델 [from ~ import ~] 만 수정하기

# 넣을 csv파일의 경로 / 파일 우클릭해서 경로 복사 권장
CSV_PATH = '../data/hashtag_clean.csv' 

with open(CSV_PATH, "r", encoding="utf-8", newline='') as csvfile: 
    data_reader = csv.DictReader(csvfile) 
    for row in data_reader: 
        # print(row)
        
        Hashtag.objects.create( 
            title = row['title'],
            singer = row['singer'], 
            group = row['group'], 
            cnt = row['cnt'], 
        )