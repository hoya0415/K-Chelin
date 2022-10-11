# 음식점 컬럼 빈 값 지우기
import pandas as pd
import numpy as np

doc = pd.read_csv('1_before_clean.csv', encoding='cp949')

# 식당 컬럼 앞뒤 공백제거
new_doc = doc['combined'].str.strip()
doc['res'] = new_doc
doc.drop('combined', axis=1, inplace=True)

# 공백을 NaN으로 바꾼 후 
doc['res'].replace('', np.nan, inplace=True)

# 빈 식당 컬럼 몇갠지
print(doc['res'].isnull().sum())

# 식당 컬럼이 NaN인 경우 전체 행 제거
doc.dropna(subset=['res'], inplace=True)

# print(doc)

doc.to_csv("1_after_clean.csv",index=False, encoding='utf-8-sig')