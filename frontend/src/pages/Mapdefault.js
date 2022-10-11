import { React, useState, useEffect } from 'react';
import {
  MapMarker,
  Map,
  CustomOverlayMap,
  Polyline,
} from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNearbyList, getStoreList } from '../_action/store_action';
import { getStoreDetail } from '../_action/store_action';
import { Button, Offcanvas } from 'react-bootstrap';
import me from '../assets/me.png';
import resto from '../assets/restaurant.png';
import StoreItem from '../components/Store/StoreItem';
import { getMapLocaion } from '../_action/map_action';
import SearchBarMap from '../components/Search/SearchBarMap';
import MapRegionList from '../components/Mapdefault/MapRegionList';

function Mapdefault() {
  // HOOK
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { center, nearbyList, placeList } = useSelector((state) => ({
    center: state.map.center,
    nearbyList: state.store.nearbyList,
    placeList: state.store.placeList,
  }));
  // 내 위치 가져오기
  const myLocation = () => {
    const firstLocation = {
      center: {
        lat: 35.8427721,
        lng: 129.2062821,
      },
    };
    dispatch(getMapLocaion(firstLocation.center));
    // if (navigator.geolocation) {
    //   // GeoLocation을 이용해서 접속 위치를 얻어옴
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const newCenter = {
    //         center: {
    //           lat: position.coords.latitude, // 위도
    //           lng: position.coords.longitude, // 경도
    //         },
    //       };
    //       dispatch(getMapLocaion(newCenter.center));
    //     },
    //     (err) => {
    //       dispatch(getMapLocaion(firstLocation.center));
    //       console.log(err.message);
    //     }
    //   );
    // } else {
    //   // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용
    //   dispatch(getMapLocaion(firstLocation.center));
    //   console.log('geolocation을 사용할수 없어요.');
    // }
  };

  useEffect(() => {
    dispatch(getMapLocaion(center));
    dispatch(getNearbyList(center.lat, center.lng))
      .catch((err) => console.log(err));
  }, [dispatch]);


  // 가게 상세로 이동
  const moveToDetail = (storeId) => {
    dispatch(getStoreDetail(storeId))
      .then(() => navigate(`/store/${storeId}`))
      .catch((err) => console.log(err));
  };
  // 직접 지도 움직여서 새로운 곳으로 센터 이동
  const newnewLocation = (map) => {
    const newnewCenter = {
      center: {
        lat: map.getCenter().getLat(),
        lng: map.getCenter().getLng(),
      },
    };
    dispatch(getMapLocaion(newnewCenter.center));
    dispatch(getNearbyList(newnewCenter.center.lat, newnewCenter.center.lng));
    // console.log(nearbyList);
  };
  // 주변 맛집 리스트
  function OffCanvasExample({ name, ...props }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    return (
      <>
        <div className='map-btn' onClick={toggleShow}>
          <img src={resto} className='map-icon' />
          <div className='map-text'>주변맛집</div>
        </div>
        <Offcanvas
          show={show}
          onHide={handleClose}
          {...props}
          id='map-offcanvas'
        >
          <Offcanvas.Header style={{ paddingBottom: '0px' }} closeButton>
            <Offcanvas.Title style={{ fontWeight: 'bold' }}>
              주변 맛집
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body id='map-offcanvas-body'>
            <div className='map-store-container'>
              {nearbyList?.map((resto, i) => (
                <div
                  onClick={() => moveToDetail(resto.store.id)}
                  key={i}
                  className='map-store'
                >
                  <StoreItem store={resto} size={120} />
                </div>
              ))}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  return (
    <>
      <div className='map-top-con'>
        <SearchBarMap show={show} setShow={setShow} />
        <div className='map-btn-con'>
          <div onClick={myLocation} className='map-btn'>
            <img src={me} className='map-icon' />
            <div className='map-text'>현재위치</div>
          </div>
          <OffCanvasExample
            name={'주변 맛집'}
            placement='bottom'
            scroll={true}
            backdrop={false}
          ></OffCanvasExample>
        </div>
      </div>
      {center && (
        <Map // 지도를 표시할 Container
          id={`map`}
          center={center}
          style={{
            // 지도의 크기
            width: '100vw',
            height: '100vh',
            position: 'relative',
          }}
          level={4}
          onDragEnd={newnewLocation}
        >
          <Polyline
            path={[
              (37.54736760072719, 127.04745864193566),
              (37.5465529, 127.0423085),
            ]}
          ></Polyline>

          {/* 내 위치 표시  */}
          {center && (
            <MapMarker
              position={center}
              image={{
                src: 'https://cdn.discordapp.com/attachments/867763766396321846/957922014163791883/unknown.png', // 마커이미지
                size: {
                  widht: 'auto',
                  height: 35,
                }, // 마커이미지의 크기
              }}
            ></MapMarker>
          )}

          {center && (
            <CustomOverlayMap position={center} yAnchor={0.5} xAnchor={0.53}>
              <div className='myloca'>
                <a target='_blank' rel='noreferrer'></a>
              </div>
            </CustomOverlayMap>
          )}
          {show
            ? placeList?.map((store, i) => (
                <div key={i}>
                  <MapMarker
                    key={i}
                    position={{
                      lat: `${store.store.lat}`,
                      lng: `${store.store.lon}`,
                    }}
                    image={{
                      src: 'https://cdn.discordapp.com/attachments/867763766396321846/956795102532075520/unknown.png', // 마커이미지
                      size: {
                        widht: 24,
                        height: 35,
                      }, // 마커이미지의 크기
                      options: {
                        offset: {
                          x: 22,
                          y: 28,
                        }, // 마커이미지의 옵션
                      },
                    }}
                  ></MapMarker>
                  <CustomOverlayMap
                    position={{
                      lat: `${store.store.lat}`,
                      lng: `${store.store.lon}`,
                    }}
                    yAnchor={0.5}
                    xAnchor={0.53}
                  >
                    <div className='customoverlay'>
                      <a target='_blank' rel='noreferrer'>
                        <span
                          onClick={() => moveToDetail(store.store.id)}
                          className='title'
                        >
                          {store.store.store_name}
                        </span>
                      </a>
                    </div>
                  </CustomOverlayMap>
                </div>
              ))
            : nearbyList?.map((store, i) => (
                <>
                  <MapMarker
                    key={i}
                    position={{
                      lat: `${store.store.lat}`,
                      lng: `${store.store.lon}`,
                    }}
                    image={{
                      src: 'https://cdn.discordapp.com/attachments/867763766396321846/956795102532075520/unknown.png', // 마커이미지
                      size: {
                        widht: 24,
                        height: 35,
                      }, // 마커이미지의 크기
                      options: {
                        offset: {
                          x: 22,
                          y: 28,
                        }, // 마커이미지의 옵션
                      },
                    }}
                  ></MapMarker>

                  <CustomOverlayMap
                    key={i + 1000}
                    position={{
                      lat: `${store.store.lat}`,
                      lng: `${store.store.lon}`,
                    }}
                    yAnchor={0.5}
                    xAnchor={0.53}
                  >
                    <div className='customoverlay'>
                      <a target='_blank' rel='noreferrer'>
                        <span
                          onClick={() => moveToDetail(store.store.id)}
                          className='title'
                        >
                          {store.store.store_name}
                        </span>
                      </a>
                    </div>
                  </CustomOverlayMap>
                </>
              ))}
        </Map>
      )}
    </>
  );
}

export default Mapdefault;
