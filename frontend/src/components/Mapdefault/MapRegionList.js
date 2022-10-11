import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getStoreDetail } from '../../_action/store_action';
import StoreItem from '../Store/StoreItem';
import StoreListItem from '../Store/StoreListItem';
import Carousel from 'react-material-ui-carousel';
import { getMapLocaion } from '../../_action/map_action';

const MapRegionList = ({ show, setShow, isLoading, setIsLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { placeList } = useSelector((state) => ({
    placeList: state.store.placeList,
  }));

  const handleStoreChange = (storeIndex) => {
    if (placeList?.length > 0) {
      setIsLoading(true);
      dispatch(
        getMapLocaion({
          lat: placeList[storeIndex].store.lat,
          lng: placeList[storeIndex].store.lon,
        })
      );
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className='map-searh-result'>
      {placeList?.length > 0 && (
        <Offcanvas
          show={show}
          placement={'bottom'}
          backdropClassName={'map-search-list-backdrop'}
          scroll={true}
          onHide={() => setShow(false)}
          id='map-searh-result-con'
        >
          <Offcanvas.Header closeButton id='map-searh-result-header' />
          <Offcanvas.Body id='map-searh-result-body'>
            <Carousel
              className='near-carousel'
              autoPlay={false}
              animation={'slide'}
              duration='1000'
              navButtonsAlwaysVisible='true'
              changeOnFirstRender='true'
              onChange={(storeIndex) => handleStoreChange(storeIndex)}
              cycleNavigation='false'
              navButtonsWrapperProps={{
                style: {
                  top: '-5%',
                  margin: '0 -5px',
                },
              }}
              NextIcon={
                <img
                  src='https://cdn-icons-png.flaticon.com/128/3916/3916925.png'
                  className='near-carousel-icon'
                />
              }
              PrevIcon={
                <img
                  src='https://cdn-icons-png.flaticon.com/128/3916/3916931.png'
                  className='near-carousel-icon'
                />
              }
              indicatorIconButtonProps={{
                style: {
                  display: 'none',
                },
              }}
            >
              {placeList?.map((resto, i) => (
                <StoreListItem key={i} store={resto} isLoading={isLoading} />
              ))}
            </Carousel>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};

export default MapRegionList;
