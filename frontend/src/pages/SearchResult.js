import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StoreListItem from '../components/Store/StoreListItem';
import { Tabs, Tab } from 'react-bootstrap';
import searchIcon from '../assets/searchIcon.png';
import plus from '../assets/plus.png';
import { Box, TextField, InputAdornment } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Skeleton, CircularProgress } from '@mui/material';
import {
  getHashList,
  getSearchList,
  getSearchListStore,
  setHashKeyword,
} from '../_action/store_action';
import Pagination from 'react-js-pagination';

const SearchResult = () => {
  // HOOK
  const dispatch = useDispatch();
  const {
    artistList,
    artistListSize,
    restoList,
    restoListSize,
    hashList,
    keyword,
  } = useSelector((state) => ({
    artistList: state.store.artistList,
    artistListSize: state.store.artistListSize,
    restoList: state.store.restoList,
    restoListSize: state.store.restoListSize,
    hashList: state.store.hashList,
    keyword: state.store.keyword,
  }));

  // STATE
  const [isLoading, setIsLoading] = useState(true);
  const [itemLoading, setItemLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(keyword);

  // 검색 관련 FUNCTION
  const inputChange = (value) => {
    // 해시태그 검색
    setSearchInput(value);
    if (value === '') {
      dispatch(getHashList(0));
    } else {
      dispatch(getHashList(value))
    }
  };

  const showResult = (event) => {
    setIsLoading(true);
    setItemLoading(true);
    if (event.key === 'Enter') {
      dispatch(getHashList(0));
      dispatch(setHashKeyword(event.target.value));
      dispatch(getSearchList(event.target.value, 1)).then((res) => {
        setIsLoading(false);
        setItemLoading(false);
      });
      dispatch(getSearchListStore(searchInput, 1)).then((res) => {
        setIsLoading(false);
        setItemLoading(false);
      });
    } else if (event.type === 'click') {
      dispatch(getHashList(0));
      dispatch(setHashKeyword(event.target.lastChild.data));
      dispatch(getSearchList(event.target.lastChild.data, 1)).then((res) => {
        setIsLoading(false);
        setItemLoading(false);
      });
      dispatch(getSearchListStore(searchInput, 1)).then((res) => {
        setIsLoading(false);
        setItemLoading(false);
      });
    }
  };

  // 아티스트 페이지네이션
  const [artistPage, setArtistPage] = useState(1);
  const handleArtistPage = (e) => {
    setArtistPage(e);
    setItemLoading(true);
    dispatch(getSearchList(keyword, e))
      .then((res) => {
        setItemLoading(false);
      })
      .catch((err) => console.log(err));
  };
  // 스토어 페이지네이션
  const [restoPage, setRestoPage] = useState(1);
  const handleRestoPage = (e) => {
    setRestoPage(e);
    setItemLoading(true);
    dispatch(getSearchListStore(keyword, e)).then((res) => {
      setItemLoading(false);
    });
  };

  useEffect(() => {
    setArtistPage(1);
    setRestoPage(1);
    setIsLoading(false);
    setItemLoading(false);
    dispatch(getSearchList('', ''));
    dispatch(getSearchListStore('', ''));
  }, []);

  return (
    <div>
      <div className='search-box'>
        <div>
          <TextField
            className='main-search-input'
            onChange={(event) => inputChange(event.target.value)}
            placeholder='해시태그/가게이름 검색'
            onKeyPress={showResult}
            autoComplete='off'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <img
                    src={searchIcon}
                    style={{ width: '1em', opacity: 0.5 }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  {searchInput?.length > 0 ? (
                    <img
                      onClick={() => inputChange('')}
                      src={plus}
                      className='search-reset-btn'
                    />
                  ) : (
                    <></>
                  )}
                </InputAdornment>
              ),
            }}
            value={searchInput}
          />

          {/* 검색시 해시 자동완성 */}
          {hashList?.length > 0 ? (
            <div
              style={{
                left: '0px',
                position: 'absolute',
                zIndex: '100',
                width: '100vw',
              }}
            >
              <Box className='main-search-container col-9'>
                <div>
                  {hashList?.map((hashtag, i) => (
                    <div
                      key={i}
                      className='search-autocomplete'
                      onKeyPress={showResult}
                      onClick={showResult}
                    >
                      #{hashtag.title} | {hashtag.singer}
                    </div>
                  ))}
                </div>
              </Box>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {/* search result */}
      <div className='search-result-container'>
        <Tabs defaultActiveKey='artist' className='search-tabs'>
          <Tab eventKey='artist' title='ARTIST'>
            <div className='search-result-artist'>
              {isLoading ? (
                <CircularProgress />
              ) : artistListSize > 0 ? (
                <>
                  {artistList?.map((store, i) => (
                    <StoreListItem
                      key={i}
                      store={store}
                      isLoading={itemLoading}
                    />
                  ))}
                  <div className='pagination-con'>
                    <Pagination
                      activePage={artistPage}
                      itemsCountPerPage={10}
                      totalItemsCount={artistListSize}
                      pageRangeDisplayed={5}
                      prevPageText='‹'
                      nextPageText='›'
                      onChange={(e) => handleArtistPage(e)}
                    />
                  </div>
                </>
              ) : (
                <div className='search-none'>
                  {/* 검색 결과가 없어요 😥 <br /> 아티스트/가게명 등으로
                  검색해보세요! */}
                </div>
              )}
            </div>
          </Tab>
          <Tab eventKey='store' title='STORE'>
            <div className='search-result-artist'>
              {isLoading ? (
                <CircularProgress />
              ) : restoListSize > 0 ? (
                <>
                  {restoList?.map((store, i) => (
                    <StoreListItem
                      key={i}
                      store={store}
                      isLoading={itemLoading}
                    />
                  ))}
                  <div className='pagination-con'>
                    <Pagination
                      activePage={restoPage}
                      itemsCountPerPage={10}
                      totalItemsCount={restoListSize}
                      pageRangeDisplayed={5}
                      prevPageText='‹'
                      nextPageText='›'
                      onChange={(e) => handleRestoPage(e)}
                    />
                  </div>
                </>
              ) : (
                <div className='search-none'>
                  {/* 검색 결과가 없어요 😥
                  <br /> 아티스트/가게명 등으로 검색해보세요! */}
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchResult;
