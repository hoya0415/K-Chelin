# 'full_text' 컬럼에서 'https'가 있는 데이터만 가져오기
def https_data(file):
    https_data = file[(file['full_text'].str.contains('https'))]
    return https_data

https_data(파일명)
파일명.to_csv("tbz_jy_1.csv", encoding='utf-8-sig')