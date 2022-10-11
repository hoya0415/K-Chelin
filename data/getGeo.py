from urllib.parse import urlparse
import requests
import pandas as pd


doc = pd.read_csv('store_IH2.csv', encoding='utf-8-sig')
lst = list(doc['address'])
lst


# 네이버 API를 이용하여 결과 확인
# 인증키
client_id = ""
client_secret = ""

lists = []

def getGeocoding(lst):
    for item in (lst):
        url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=" + item
        res = requests.get(urlparse(url).geturl(), headers={"X-NCP-APIGW-API-KEY-ID":client_id,
        "X-NCP-APIGW-API-KEY":client_secret})
        df1 = res.json()

        for address in df1['addresses']:
            if address['roadAddress'] != '':
                values=[address['roadAddress'], address['x'], address['y']]
            else:
                values=[address['jibunAddress'], address['x'], address['y']]

            lists.append(values)
            df2 = pd.DataFrame(lists, columns=['Address', 'Lon', 'Lat'])
            df2.to_csv("IH_2.csv", encoding='utf-8-sig')

getGeocoding(lst)