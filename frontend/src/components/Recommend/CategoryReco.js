import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import StoreListItem from '../Store/StoreListItem';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreList } from '../../_action/store_action';
import Pagination from 'react-js-pagination';
import { CircularProgress } from '@mui/material';

const categoryList = [
  '닭볶음탕',
  '국수',
  '양식',
  '카페,디저트',
  '한식',
  '한정식',
  '갈비탕',
  '닭갈비',
  '피자',
  '바(BAR)',
  '일식당',
  '멕시코,남미음식',
  '스파게티,파스타전문',
  '베이커리',
  '프랑스음식',
  '중식당',
  '요리주점',
  '아시아음식',
  '케이크전문',
  '카페',
  '퓨전음식',
  '육류,고기요리',
  '곱창,막창,양',
  '떡볶이',
  '우동,소바',
  '감자탕',
  '국밥',
  '냉면',
  '떡볶이',
];

const CategoryReco = () => {
  const dispatch = useDispatch();
  const [dropValue, setDropValue] = useState('');
  const [filteredCate, setFilteredCate] = useState(categoryList);
  const [allCate, setAllCate] = useState(true);
  const [page, setPage] = useState(1);
  const { storeList, storeSize } = useSelector((state) => ({
    storeList: state.store.storeList,
    storeSize: state.store.storeSize,
  }));
  const [isLoading, setIsLoading] = useState(true);

  // 카테고리 필터
  const handleCateFilter = (cate) => {
    if (cate === '전체') {
      if (allCate === true) {
        setAllCate(false);
        setFilteredCate([]);
        setIsLoading(true)
        dispatch(getStoreList('category', [], dropValue, page))
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
      } else {
        setAllCate(true);
        setIsLoading(true)
        setFilteredCate(categoryList);
        dispatch(getStoreList('category', categoryList, dropValue, page))
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
      }
    } else {
      if (filteredCate.includes(cate) === false) {
        setFilteredCate((prev) => [...prev, cate]);
        setIsLoading(true)
        dispatch(
          getStoreList('category', [...filteredCate, cate], dropValue, page)
        )
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
        if (filteredCate.length >= categoryList.length - 1) {
          setAllCate(true);
        }
      } else {
        setFilteredCate((prev) => prev.filter((item) => item !== cate));
        setAllCate(false);
        setIsLoading(true)
        dispatch(
          getStoreList(
            'category',
            filteredCate.filter((item) => item !== cate),
            dropValue,
            page
          )
        )
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
      }
    }
  };
  // 정렬 이벤트 핸들러
  const handleDrop = (value) => {
    setDropValue(value);
    setIsLoading(true)
    dispatch(getStoreList('category', filteredCate, value, page))
      .then((res) => {setIsLoading(false);})
      .catch((err) => console.log(err));
  };
  // 페이지네이션
  const handlePageChange = (e) => {
    setPage(e);
    setIsLoading(true)
    dispatch(getStoreList('category', filteredCate, dropValue, e))
      .then((res) => {setIsLoading(false);})
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setPage(1)
    setIsLoading(false)
  }, [])

  return (
    <div className='reco-container'>
      <div className='reco-filter-list'>
        <div
          className='reco-filter-list-item'
          onClick={() => handleCateFilter('전체')}
        >
          <div className='reco-artist-list-item-name'>
            <div
              className={
                allCate ? ' all-artist-name selected-name' : 'all-artist-name'
              }
            >
              전체
            </div>
          </div>
        </div>
        {categoryList.map((cate, i) => (
          <div
            className='reco-filter-list-item'
            key={i}
            onClick={() => handleCateFilter(cate)}
          >
            <h5 className={filteredCate?.includes(cate) ? 'selected-name' : ''}>
              {cate}
            </h5>
          </div>
        ))}
        <div className='reco-filter-list-item'></div>
      </div>
      <div>
        <div className='reco-sort'>
          <Dropdown onSelect={(value) => handleDrop(value)}>
            <Dropdown.Toggle variant='none'>정렬</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey='store_cnt'>인기순</Dropdown.Item>
              <Dropdown.Item eventKey='reviews_cnt'>리뷰순</Dropdown.Item>
              <Dropdown.Item eventKey='name_down'>이름순↓</Dropdown.Item>
              <Dropdown.Item eventKey='name_up'>이름순↑</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className='reco-store-list'>
        {storeList && storeSize > 0 ? (
          storeList?.map((store, i) => <StoreListItem key={i} store={store} isLoading={isLoading} />)
        ) : (
            <div className='reco-store-list-empty'>
              {/* 결과가 없습니다 */}
              <CircularProgress />
            </div>
        )}
      </div>
      {storeSize > 0 && (
        <div className='pagination-con'>
          <Pagination
            activePage={page}
            itemsCountPerPage={10}
            totalItemsCount={storeSize}
            pageRangeDisplayed={5}
            prevPageText='‹'
            nextPageText='›'
            onChange={(e) => handlePageChange(e)}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryReco;
