import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import tel from '../../assets/tel.png';
import map from '../../assets/map.png';
import time from '../../assets/time.png';
import { MapMarker, Map, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useDispatch } from 'react-redux';
import { getMapLocaion } from '../../_action/map_action';
const StoreInfo = ({ store }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const center = {
    lat: `${store.store.lat}`,
    lng: `${store.store.lon}`,
  };
  // console.log(store, center);
  const handleClick = () => {
    dispatch(getMapLocaion(center));
    navigate('/map');
  };
  return (
    <div className='store-info-container'>
      <div className='store-info-address'>
        <img src={map} />
        <h4>{store.store.address}</h4>
        <br />
        <div
          className='store-info-map'
          onClick={() => {
            handleClick();
          }}
        >
          <Map // 지도를 표시할 Container
            center={{ lat: `${store.store.lat}`, lng: `${store.store.lon}` }}
            style={{
              // 지도의 크기
              width: '100%',
              height: '27vh',
            }}
            level={5} // 지도의 확대 레벨
          >
            <MapMarker
              position={{ lat: `${store.store.lat}`, lng: `${store.store.lon}` }}
              opacity={1}
            ></MapMarker>
          </Map>
        </div>
      </div>
      {store.store.tel ? (
        <div className='store-info-tel'>
          <img src={tel} />
          <h5>{store.store.tel}</h5>
        </div>
      ) : (
        <></>
      )}
      {store.store.business_hours ? (
        <Accordion flush>
          <Accordion.Item>
            <Accordion.Header>
              <img src={time} />
              영업시간
            </Accordion.Header>
            <Accordion.Body>
              {store.store.business_hours.split('/').map((line, i) => {
                return <div key={i}>{line}<br></br></div>
              })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StoreInfo;
