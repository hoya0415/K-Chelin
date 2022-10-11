import csv
import os 
import django 

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings") 
django.setup() 

from stores.models import Store
# backend 폴더에 넣고 하는것을 권장 / 바로 윗줄 모델 [from ~ import ~] 만 수정하기

# 넣을 csv파일의 경로 / 파일 우클릭해서 경로 복사 권장
CSV_PATH = '../data/store_final.csv' 

with open(CSV_PATH, "r", encoding="utf-8", newline='') as csvfile: 
    data_reader = csv.DictReader(csvfile) 
    paldo = ['경기', '경남', '경북', '전남', '전북', '충북', '충남', '강원', 
            '경기도', '경상남도', '경상북도', '전라남도', '전라북도', '충청북도', '충청남도', '강원도']

    for row in data_reader: 
        # print(row)
        add_lst = row['address'].split(' ')
        if add_lst[0] == '서울' or add_lst[0] == '서울특별시': # 서울이면 구 단위로
            if len(add_lst[1]) == 2:  # 중구 때문에 추가해줌('중'이라고 나오면 안되니꽈..)
                simple_address = add_lst[1]
            else:
                simple_address = add_lst[1][:-1]
        elif add_lst[0] in paldo:   # 팔도에 속하면 그 다음시 뽑아냄
            simple_address = add_lst[1]
        else:   # 특별시면 특별시 그대로 나오게 함
            simple_address = add_lst[0]
        

        Store.objects.create( 
            map_id = row['\ufeffres_id'],
            store_name = row['store_name'], 
            address = row['address'], 
            simple_address = simple_address,
            category = row['category'], 
            tel = row['tel'], 
            business_hours = row['business_hours'], 
            store_cnt = row['res_cnt'], 
            lat = row['Lat'],
            lon = row['Lon'],
        )