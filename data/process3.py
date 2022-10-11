# 음식점 컬럼 생성
import pandas as pd

doc = pd.read_csv('파일이름.csv', encoding='cp949')

# full_text 필드를 줄 바꿈 기준으로 나누기
new_doc = doc["full_text"].str.split("\n", expand=True)


# ??가 들어간 데이터만 남기고 모두 공백으로 처리하는 함수
def change_data(x):
    x = str(x)
    if x == None:
        return x.replace(x, "")
    elif "??" not in x and "'" not in x and '"' not in x and "[" not in x and "!!" not in x and "-" not in x and "*" not in x: 
        if x:
            return x.replace(x, "")
    elif len(x) > 15:
        return x.replace(x, "")
    return x
    

# 모든 열에 change_data 함수 실행
for i in range(new_doc.shape[1]):
    new_doc[i]=new_doc[i].apply(change_data)


# new_doc 데이터를 하나의 열('combined')로 압축 및 특수문자 삭제
cols = [i for i in range(new_doc.shape[1])]
new_doc['combined'] =new_doc[cols].apply(lambda row: ' '.join(row.values.astype(str)), axis=1)
new_doc['combined'] =new_doc['combined'].str.replace(pat=r'[^\w]',repl=r' ',regex=True)

# combined 열만 추출
new = new_doc['combined']


# 기존 데이터에 combined 열 추가
doc['combined'] = new

print(doc)
# doc.to_csv("bts_jungkook_t.csv",index=False, encoding='utf-8-sig')