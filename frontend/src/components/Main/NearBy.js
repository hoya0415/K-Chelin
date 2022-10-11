import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Skeleton } from '@mui/material';
import { getNearbyList, getStoreDetail } from '../../_action/store_action';
import { useDispatch, useSelector } from 'react-redux';
import { getMapLocaion } from '../../_action/map_action';
import { useNavigate } from 'react-router-dom';
import logo_sky_back from '../../assets/logo_sky_back.png';

const NearBy = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { center, nearbyList } = useSelector((state) => ({
    center: state.map.center,
    nearbyList: state.store.nearbyList,
  }));

  const moveToDetail = (storeId) => {
    dispatch(getStoreDetail(storeId))
      .then((res) => {
        // console.log(res);
        navigate(`/store/${storeId}`);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (nearbyList) {
      setIsLoading(false);
    }
  }, []);

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
    //   alert('geolocation을 사용할수 없어요.');
    // }
  };
  useEffect(() => {
    myLocation();
    dispatch(getNearbyList(center.lat, center.lng)).then((res) => {
      // console.log(res.payload);
    });
    setIsLoading(false);
  }, []);
  return (
    <>
      <div className='near-text'>
        <div className='near-title'>#엎어지면_코_닿는_맛집</div>
        <div className='near-subtitle'>
          현재 위치와 가까운 찐맛집만 모아모아
        </div>
      </div>
      <Carousel
        className='near-carousel'
        autoPlay='false'
        animation='slide'
        duration='1000'
        interval='7000'
        navButtonsAlwaysVisible='true'
        navButtonsProps={{
          style: {
            backgroundColor: 'transparent',
          },
        }}
        navButtonsWrapperProps={{
          style: {
            top: '-5%',
            margin: '0 15px 0 15px',
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
            padding: '5px',
            color: '#6694cc50',
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            backgroundColor: '#6694cc20',
          },
        }}
      >
        {nearbyList?.map((item, i) => (
          <Paper key={i} className='near-carousel-container'>
            <div
              className='near-storename'
              onClick={() => moveToDetail(item.store.id)}
            >
              <h2>{item.store.store_name}</h2>
            </div>
            {isLoading ? (
              <Skeleton
                variant='rectangular'
                className='near-carousel-img'
                width={310}
                height={280}
              />
            ) : (item.imgs.length > 0) & (item.imgs[0] !== '') ? (
              <img src={item.imgs[0]} className='near-carousel-img' />
            ) : (
              <img className='near-carousel-img' src={logo_sky_back} />
            )}
          </Paper>
        ))}
      </Carousel>
    </>
  );
};

export default NearBy;
