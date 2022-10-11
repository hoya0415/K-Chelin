import React from 'react';
import { useState, useEffect } from 'react';
import searchIcon from '../../assets/searchIcon.png';
import { Box, TextField, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreList, getStoreDetail } from '../../_action/store_action';
import StoreListItem from '../Store/StoreListItem';
import { useNavigate } from 'react-router-dom';
import { getSearchListPlace } from '../../_action/store_action';
import MapRegionList from '../Mapdefault/MapRegionList';
import { getMapLocaion } from '../../_action/map_action';

const SearchBarMap = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const showResult = (event) => {
    if (event.key === 'Enter' && searchInput !== '') {
      setIsLoading(true);
      dispatch(getSearchListPlace(searchInput, '')).then((res) => {
        if (res.payload.storeList.length > 0) {
          dispatch(
            getMapLocaion({
              lat: res.payload.storeList[0].store.lat,
              lng: res.payload.storeList[0].store.lon,
            })
          );
        }
        setShow(true);
        setIsLoading(false);
      });
    }
  };

  return (
    <Box className='map-search-bar' autoComplete='off'>
      <TextField
        onChange={(event) => setSearchInput(event.target.value)}
        onKeyPress={showResult}
        placeholder='지역을 검색하세요'
        autoComplete='off'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <img src={searchIcon} style={{ width: '1em', opacity: 0.5 }} />
            </InputAdornment>
          ),
        }}
      />
      <div>
        <MapRegionList
          show={show}
          setShow={setShow}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </Box>
  );
};
export default SearchBarMap;
