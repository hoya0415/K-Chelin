# 필요 컬럼만 가져오기
import pandas as pd

doc = pd.read_csv('jy_1792.csv', encoding='utf-8-sig')

def raw_to_ver1():
    new_doc = doc[['id','created_at', 'url', 'full_text', 
    'media/0/media_url_https', 'media/1/media_url_https','media/2/media_url_https', 'media/3/media_url_https',
    'hashtags/0', 'hashtags/1', 'hashtags/2', 'hashtags/3', 'hashtags/4', 'hashtags/5', 'hashtags/6', 'hashtags/7', 'hashtags/8', 'hashtags/9']]
    return new_doc

raw_to_ver1()