import React, { useState } from 'react';
import searchIcon from '../../assets/searchIcon.png';
import plus from '../../assets/plus.png';
import { Box, TextField, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getHashList,
  getSearchList,
  getSearchListStore,
  setHashKeyword,
} from '../../_action/store_action';

const Search = () => {
  // HOOK
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // STATE
  const { hashList, keyword } = useSelector((state) => ({
    hashList: state.store.hashList,
    keyword: state.store.keyword,
  }));
  const [searchInput, setSearchInput] = useState('');

  // 검색 관련 FUNCTION
  const inputChange = (value) => {
    // 해시태그 검색
    setSearchInput(value);
    if (value === '') {
      dispatch(getHashList(0));
    } else {
      dispatch(getHashList(value));
    }
  };

  const showResult = (event) => {
    if (event.key === 'Enter') {
      dispatch(getHashList(0));
      dispatch(setHashKeyword(event.target.value));
      dispatch(getSearchList(event.target.value, 1)).then(() =>
        navigate('/searchresult')
      );
      dispatch(getSearchListStore(searchInput, 1));
    } else if (event.type === 'click') {
      dispatch(getHashList(0));
      dispatch(setHashKeyword(event.target.lastChild.data));
      dispatch(getSearchList(event.target.lastChild.data, 1)).then((res) => {
        navigate('/searchresult');
      });
      dispatch(getSearchListStore(searchInput, 1));
    }
  };

  return (
    <div>
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
                <img src={searchIcon} style={{ width: '1em', opacity: 0.5 }} />
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
              // height: '100px',
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
  );
};

export default Search;
