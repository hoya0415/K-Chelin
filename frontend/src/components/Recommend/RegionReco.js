import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import StoreListItem from '../Store/StoreListItem';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreList } from '../../_action/store_action';
import Pagination from 'react-js-pagination';
import { CircularProgress } from '@mui/material';

const regions = [  
  // 서울
  '강남',
  '강동',
  '강북',
  '강서',
  '관악',
  '광진',
  '구로',
  '금천',
  '노원',
  '동작',
  '마포',
  '서대문',
  '서초',
  '성동',
  '송파',
  '양천',
  '영등포',
  '용산',
  '은평',
  '종로',
  '중구',
  '중랑',

  // 광역시
  '부산',
  '대구',
  '대전',
  '제주',
  '울산',
  '인천',
  '광주',

  // 강원도
  '강릉시',
  '강원시',
  '원주시',
  '평창군',
  '횡성군',

  // 경상도
  '구미시',
  '경주시',
  '창원시',

  // 경기도
  '고양시',
  '광주시',
  '김포시',
  '수원시',
  '성남시',
  '시흥시',
  '안양시',
  '용인시',
  '천안시',
  '파주시',
  '하남시',

  // 전라도
  '담양군',
  '순천시',
  '여수시',
  '익산시',
  '전주시',

  // 충청도
  '충주시',

];

const RegionReco = () => {
  const dispatch = useDispatch();
  const [dropValue, setDropValue] = useState('');
  const [filteredRegion, setFilteredRegion] = useState(regions);
  const [allRegion, setAllRegion] = useState(true);
  const [page, setPage] = useState(1);
  const { storeList, storeSize } = useSelector((state) => ({
    storeList: state.store.storeList,
    storeSize: state.store.storeSize,
  }));
  const [isLoading, setIsLoading] = useState(true);

  // 지역 필터
  const handleRegionFilter = (region) => {
    if (region === '전체') {
      if (allRegion === true) {
        setAllRegion(false);
        setFilteredRegion([]);
        setIsLoading(true)
        dispatch(getStoreList('region', [], dropValue, page))
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
      } else {
        setAllRegion(true);
        setFilteredRegion(regions);
        setIsLoading(true)
        dispatch(getStoreList('region', regions, dropValue, page))
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
      }
    } else {
      if (filteredRegion.includes(region) === false) {
        setFilteredRegion((prev) => [...prev, region]);
        setIsLoading(true)
        dispatch(
          getStoreList('region', [...filteredRegion, region], dropValue, page)
        )
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
        if (filteredRegion.length >= regions.length - 1) {
          setAllRegion(true);
        }
      } else {
        setFilteredRegion((prev) => prev.filter((item) => item !== region));
        setAllRegion(false);
        setIsLoading(true)
        dispatch(
          getStoreList(
            'region',
            filteredRegion.filter((item) => item !== region),
            dropValue,
            page,
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
    dispatch(getStoreList('region', filteredRegion, value, page))
      .then((res) => {setIsLoading(false);})
      .catch((err) => console.log(err));
  };
  // 페이지네이션
  const handlePageChange = (e) => {
    setPage(e);
    setIsLoading(true)
    dispatch(getStoreList('region', filteredRegion, dropValue, e))
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
          onClick={() => handleRegionFilter('전체')}
        >
          <div className='reco-artist-list-item-name'>
            <div
              className={
                allRegion ? ' all-artist-name selected-name' : 'all-artist-name'
              }
            >
              전체
            </div>
          </div>
        </div>
        {regions.map((region, i) => (
          <div
            className='reco-filter-list-item'
            key={i}
            onClick={() => handleRegionFilter(region)}
          >
            <h5
              className={
                filteredRegion?.includes(region) ? 'selected-name' : ''
              }
            >
              {region}
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

export default RegionReco;
