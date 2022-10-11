import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreList } from '../../_action/store_action';
import StoreListItem from '../Store/StoreListItem';
import Pagination from 'react-js-pagination';
import { useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const artists = [
  {
    name: '블랙핑크',
    url: 'https://i.pinimg.com/originals/27/3b/81/273b8102e30cd5e02279e535226bb524.png',
    color: '#f7a7bb',
  },
  {
    name: 'NCT',
    url: 'https://w.namu.la/s/aca8b16c8a3a7949f4dc93ec48280bcc500ddb0d65ff2d4109d5ceac408aac6d45e8318184637900ee14618f117b6ba2747702bfd65e0b9968863426ff7b1b91bdea4a54c1dc07de637f6f0185a2c7aec3f2185824486c924a72cca8bb8975a5',
    color: '#bbe309'},
  {
    name: 'BTS',
    url: 'https://i.pinimg.com/550x/ba/a6/6d/baa66d4f7ee14d321f1a4984db93e2c3.jpg',
    color: '#A020F0',
  },  
  {
    name: '세븐틴',
    url: 'https://media.discordapp.net/attachments/867763766396321846/959108545041825892/www.png',
    color: ['#F7CAC9', '#92A8D1'],
  },
  {
    name: '몬스타X',
    url: 'https://i.pinimg.com/550x/e7/0a/5e/e70a5e4970c8177819af2e44c35b7e83.jpg',
    color: ['#288BA0', '#00008B', '#B5008C'],
  },  
  {
    name: '더보이즈',
    url: 'https://media.discordapp.net/attachments/867763766396321846/959107100523524136/zz.jpg',
    color: '#D11416',
  },  
  {
    name: 'IU',
    url: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTA1MjdfNTMg%2FMDAxNjIyMDY4NTY2NjE1.gruqSPjmPfwMvnSzcxwgmFJM7hvYhhMIF9IjJIessr0g.TUlj5g91X1cpdQlO2KwlrdlHwijEvw1J57CEDLRxl4Yg.JPEG.chaechae0517%2F20200921%25A3%25DF161727.jpeg&type=sc960_832',    
  },
  {
    name: 'WOODZ',
    url: 'https://cdn.discordapp.com/attachments/867763766396321846/959102336838549605/20200608083238938wecc.jpg',
    color: ['#ff6900', '#1322aa']
  },
  {
    name: 'ETC',
    url: 'https://yt3.ggpht.com/ytc/AKedOLRTE0BzdlOAFDJ5ITdZSqRENpekJM3nsKAHIPd5Vw=s176-c-k-c0x00ffffff-no-rj'
  },
];

const ArtistReco = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [dropValue, setDropValue] = useState('');
  const [filteredArtists, setFilteredArtists] = useState([
    '블랙핑크',
    '몬스타X',
    'BTS',
    'WOODZ',
    'NCT',
    '세븐틴',
    'IU',
    '더보이즈',
    'ETC',
  ]);
  const [allArtist, setAllArtist] = useState(true);
  const [page, setPage] = useState(1);
  const { storeList, storeSize } = useSelector((state) => ({
    storeList: state.store.storeList,
    storeSize: state.store.storeSize,
  }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(location.state.mainArtist !== "") {
      setFilteredArtists([location.state.mainArtist])
    }
  },[]);

  // 아티스트 필터
  const handleArtistFilter = (artist) => {
    if (artist === '전체') {
      if (allArtist === true) {
        setAllArtist(false);
        setFilteredArtists([]);
        setIsLoading(true)
        dispatch(getStoreList('artist', [], dropValue, page))
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
      } else {
        setAllArtist(true);
        setIsLoading(true)
        setFilteredArtists([
          '블랙핑크',
          '몬스타X',
          'BTS',
          'WOODZ',
          'NCT',
          '세븐틴',
          'IU',
          '더보이즈',
          'ETC',
        ]);
        dispatch(
          getStoreList(
            'artist',
            [
              '블랙핑크',
              '몬스타X',
              'BTS',
              'WOODZ',
              'NCT',
              '세븐틴',
              'IU',
              '더보이즈',
              'ETC',
            ],
            dropValue,
            page
          )
        )
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
      }
    } else {
      if (filteredArtists.includes(artist) === false) {
        setFilteredArtists((prev) => [...prev, artist]);
        setIsLoading(true)
        dispatch(
          getStoreList('artist', [...filteredArtists, artist], dropValue, page)
        )
          .then((res) => {setIsLoading(false);})
          .catch((err) => console.log(err));
        if (filteredArtists.length >= artists.length - 1) {
          setAllArtist(true);
        }
      } else {
        setFilteredArtists((prev) => prev.filter((item) => item !== artist));
        setAllArtist(false);
        setIsLoading(true)
        dispatch(
          getStoreList(
            'artist',
            filteredArtists.filter((item) => item !== artist),
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
    setIsLoading(true);
    dispatch(getStoreList('artist', filteredArtists, value, page))
      .then((res) => {setIsLoading(false);})
      .catch((err) => console.log(err));
  };
  // 페이지네이션
  const handlePageChange = (e) => {
    setPage(e);
    setIsLoading(true);
    dispatch(getStoreList('artist', filteredArtists, dropValue, e))
      .then((res) => {setIsLoading(false);})
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    setPage(1);
    setIsLoading(false)
  }, []);


  return (
    <div className='reco-container'>
      <div className='reco-filter-list'>
        <div
          className='reco-filter-list-item'
          onClick={() => handleArtistFilter('전체')}
        >
          <div className='reco-artist-list-item-name'>
            <div
              className={
                allArtist ? ' all-artist-name selected-name' : 'all-artist-name'
              }
            >
              전체
            </div>
          </div>
        </div>
        {artists.map((artist, i) => (
          <div
            className='reco-filter-list-item'
            key={i}
            onClick={() => handleArtistFilter(artist.name)}
          >
            <div className='reco-artist-list-item-img'>
              <img
                src={artist.url}
                className={
                  filteredArtists?.includes(artist.name) ? 'selected-img' : ''
                }
              />
            </div>
            <div className='reco-artist-list-item-name'>
              <h5
                className={
                  filteredArtists?.includes(artist.name) ? 'selected-name' : ''
                }
              >
                {artist.name}
              </h5>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className='reco-sort'>
          <Dropdown onSelect={(e) => handleDrop(e)}>
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
          storeList?.map((store, i) => (
            <StoreListItem key={i} store={store} isLoading={isLoading} />
          ))
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

export default ArtistReco;
