# # 북마크 추천은 장바구니 추천이랑 비슷하게 생각..
# from mlxtend.frequent_patterns import association_rules
# from mlxtend.preprocessing import TransactionEncoder
# from mlxtend.frequent_patterns import apriori
# import pandas as pd


# dataset = [['진대감', '오복수산', '랫댓', '하이디라오'], ['진대감', '스타벅스', '투썸', '랫댓'],
#             ['칼국수', '간장게장', '오복수산', '랫댓'], ['왓왓', '뭐부터', '투썸']]

# # 위 dataset을 True, False로 표시하고 dataframe으로 나타냄
# te = TransactionEncoder()
# te_result = te.fit(dataset).transform(dataset)
# df = pd.DataFrame(te_result, columns=te.columns_)


# # 데이터 프레임에서 각 itemset의 support를 구함
# # min_support이상의 support부터 나타남
# frequent = apriori(df, min_support=0.001, use_colnames=True)
# # 특정 개수 이상의 itemset만 추출
# frequent['length'] = frequent['itemsets'].apply(lambda x: len(x))
# freq1 = frequent[frequent['length'] >= 2]
# # 특정 아이템이 포함된 것만 추출
# frequent_itemsets = freq1[freq1['itemsets'].apply(lambda x: '진대감' in list(x))]
# # print(frequent_itemsets)


# # 신뢰도 구하기
# # 최소 신뢰도가 0.7이상인 것만 추출
# rules = association_rules(frequent, metric='confidence', min_threshold=0.7)
# print(rules)
# # 최소 지지도가 0.7이상인 것만 추출
# # rules2 = association_rules(frequent, metric='lift', min_threshold=3.0)
# # antecedents가 '진대감'이고, consequents가 하나일 때 lift 젤 작은 것 찾기
# # df = rules[(rules.antecedents == frozenset({'진대감'})) & (rules.consequents.apply(lambda x: len(x) == 2))].sort_values(by='lift')
# df = rules[(rules.antecedents.astype(str).str.lower().str.contains('진대감') & (rules.antecedents.astype(str).str.lower().str.contains('랫댓')))]
# # df = rules[(rules.antecedents == frozenset({'진대감'}))].sort_values(by='lift')
# print(df)

#-------------------------------------------------------------------------------------------------------------------------------------------------------------------

bookmarks = Bookmark.objects.exclude(user=2)
user_bookmarks = Bookmark.objects.filter(user=2)
for user_bookmark in user_bookmarks:
    print(user_bookmark.stores.all())

stores = []
for bookmark in bookmarks:
    user = []
    for store in bookmark.stores.all():
        user.append(store.store_name)
    stores.append(user)
print(stores)


from mlxtend.frequent_patterns import association_rules
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori
import pandas as pd


# 위 dataset을 True, False로 표시하고 dataframe으로 나타냄
te = TransactionEncoder()
te_result = te.fit(stores).transform(stores)
df = pd.DataFrame(te_result, columns=te.columns_)


# 데이터 프레임에서 각 itemset의 support를 구함
# min_support이상의 support부터 나타남
frequent = apriori(df, min_support=0.001, use_colnames=True)
# 특정 개수 이상의 itemset만 추출
frequent['length'] = frequent['itemsets'].apply(lambda x: len(x))
# freq1 = frequent[frequent['length'] >= 2]
# # 특정 아이템이 포함된 것만 추출
# frequent_itemsets = freq1[freq1['itemsets'].apply(lambda x: '진대감' in list(x))]
# # print(frequent_itemsets)


# 신뢰도 구하기
# 최소 신뢰도가 0.7이상인 것만 추출
rules = association_rules(frequent, metric='confidence', min_threshold=0.8)
print(rules)
df = rules[(rules.antecedents.astype(str).str.lower().str.contains('하이디라오 홍대점') & (rules.consequents.apply(lambda x: len(x) == 2)))].sort_values(by='lift')
print(df)
# for row in range(len(df)):
#     print(df.iloc[row]['consequents'])
#     print(row)

