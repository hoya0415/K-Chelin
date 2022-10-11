from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
from urllib.parse import urlparse
from bs4 import BeautifulSoup as bs
import pandas as pd
import numpy as np

# dataframe 만들기
df = pd.DataFrame(columns=['res_id', 'store_name', 'category', 'address', 'tel', 'business_hours', 'res_cnt'])
# 파일 받아와서 식당 컬럼만 리스트로 변환
doc = pd.read_csv('result_담당자이름.csv', encoding='cp949')
res_lst = list(doc['res'])
# review.csv 파일에 'res_id' 컬럼 추가(default=NaN)
doc['res_id'] = np.nan

# 식당 리스트 돌아가면서 검색
for idx in range(len(res_lst)):
    # 검색할 식당 이름
    find = res_lst[idx]
    # 블루투스 장치 오류 때문에 추가해준 코드
    options =webdriver.ChromeOptions()
    options.add_experimental_option("excludeSwitches", ["enable-logging"])
    # 크롬 실행
    driver = webdriver.Chrome(
        executable_path= "./chromedriver.exe",
        options=options
    )
    url = "https://m.map.naver.com/"
    driver.get(url) 
    action = ActionChains(driver)

    # input박스 클릭 후 식당 검색 
    time.sleep(4)
    driver.find_element_by_class_name('Nbox_input_text').click()
    driver.find_element_by_class_name('Nbox_input_text._search_input').send_keys(find)
    driver.find_element_by_xpath('//*[@id="ct"]/div[1]/div[1]/form/div/div[2]/div/span[2]/button[2]').click()

    # 검색결과 첫번째 결과 클릭
    try:
        time.sleep(2)
        driver.find_element_by_xpath('//*[@id="ct"]/div[2]/ul/li[1]/div[1]/a[2]').click()
        
        time.sleep(2)
        # 해당 식당의 고유 id 가져오기
        url = driver.current_url
        url_lst = url.split('/')
        res_id = int(url_lst[4])

        # 해당 식당 고유 값을 review.csv의 ['res_id'] 컴럼에 추가
        doc.loc[idx,'res_id'] = res_id
        
        # 현재까지 추가된 식당 data에 겹치는게 있는지 확인
        if res_id not in list(df['res_id']): # 겹치는게 없으면
        
            # 영업시간 상세보기 클릭
            is_hours = True
            try:
                driver.find_element_by_class_name('_318hN').click()
            except:
                is_hours = False
                business_hours = np.nan
            print('=================================================================')

            # 현재 페이지 html 가져옴
            time.sleep(2)
            html = driver.page_source
            soup = bs(html, 'html.parser') 

            # 식당 이름 가져오기 
            store_name = soup.find('span', {'class':'_3XamX'}).text

            # 카테고리 가져오기
            try:
                category = soup.find('span', {'class':'_3ocDE'}).text
            except:
                category = np.nan

            # 주소 가져오기 
            try:
                address = soup.find('span', {'class': '_2yqUQ'}).text
            except:
                address = np.nan

            # 전화번호 가져오기
            try:
                tel_tag = soup.find('a', {'class':'_3HEBM'})
                tel = tel_tag.attrs['href'][4:]
            except:
                tel = np.nan

            if is_hours:    # 영업시간이 기재된 경우
                # 영업시간 가져오기 -> 영업시간 데이터프레임에 월:10:00-22:00, 화:10:00-22:00, ... 형태로 넣기
                days = soup.findAll('span', {'class':'j9L2O'})
                times = soup.findAll('div', {'class':'_2WoIY'})
                hours = []
                for i, day in enumerate(days):
                    hour = day.text+":"+times[i].text
                    hours.append(hour)
                business_hours = "/".join(hours)


            # print(res_id, store_name, category, address, tel, business_hours, sep='\n')
            # 데이터 프레임 df에 저장
            i = len(df)
            df.loc[i] = [res_id, store_name, category, address, tel, business_hours, 0]
    
    # 검색결과 없으면 pass
    except:
        pass

# print(doc)
# print(df)

# 식당 csv파일로 저장
df.to_csv("store_담당자이름.csv",index=False, encoding='utf-8-sig')
# col 추가한 review 저장
doc.to_csv("review_담당자이름.csv", index=False, encoding='utf-8-sig')