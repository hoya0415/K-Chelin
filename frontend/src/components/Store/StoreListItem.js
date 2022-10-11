// 직사각형 가게 리스트
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import BmarkAdd from '../Bookmark/BmarkAdd';
import BmarkMinus from '../Bookmark/BmarkMinus';
import review_icon from '../../assets/review_icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreDetail } from '../../_action/store_action';
import { Skeleton } from '@mui/material';
import logo_sky_back from '../../assets/logo_sky_back.png';

const StoreListItem = ({ store, isLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getDistance, setGetDistance] = useState()

  const { lat1, lng1 } = useSelector((state) => ({
    lat1: state.map.center.lat,
    lng1: state.map.center.lng,
  }));

  const moveToDetail = () => {
    dispatch(getStoreDetail(store.store.id))
      .then((res) => {
        navigate(`/store/${store.store.id}`);
      })
      .catch((err) => console.log(err));
  };
  
  // const newHashtags = [...new Set(store.group)];

  const handleDistance = () => {
    let radius = 6371
    let dlat = (store.store.lat-lat1) * Math.PI / 180
    let dlng = (store.store.lon-lng1) * Math.PI / 180
    let a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos((lat1 * Math.PI / 180)) * Math.cos((store.store.lat * Math.PI / 180)) * Math.sin(dlng/2) * Math.sin(dlng/2) 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
    let d = radius * c
    setGetDistance(Math.round(d))
  }
  
  useEffect(() => {
    handleDistance()
  }, [store]);


  return (
    <Container>
      <Row className='store-list-item'>
        <Col xs={3}>
          <div className='store-list-item-img' onClick={moveToDetail}>
            {isLoading ? (
              <Skeleton variant='circular' width={85} height={85} />
            ) : store.imgs.length > 0 & store.imgs[0] !== '' ? (
              <img src={store.imgs[0]} />
            ) : (
              <img src={logo_sky_back} />
            )}
          </div>
        </Col>
        {isLoading ? (
          <Skeleton
            className='col-8 store-list-item-info'
            width={200}
            height={63.5}
          />
        ) : (
          <>
            <Col xs={7} className='store-list-item-info' onClick={moveToDetail}>
              <div className='store-list-item-tag-container'>
                {store.group?.map((tag, i) => (
                  <div
                    key={i}
                    className={
                      tag === 'NCT'
                        ? 'nct'
                        : tag === '더보이즈'
                        ? 'theboys'
                        : tag === '블랙핑크'
                        ? 'blackpink'
                        : tag === '세븐틴'
                        ? 'seventeen'
                        : tag === 'BTS'
                        ? 'bts'
                        : tag === '몬스타X'
                        ? 'monstax'
                        : tag === 'EXO'
                        ? 'exo'
                        : tag === '민현'
                        ? 'mh'
                        : tag === 'WOODZ'
                        ? 'woodz'
                        : 'store-list-item-tag'
                    }
                  >
                    #{tag}
                  </div>
                ))}
              </div>
              <div className='store-list-item-info-name-con'>
                <h4>{store.store.store_name}</h4>
                <h5>{getDistance}km</h5>
              </div>
              <div className='store-list-item-info-text-con'>
                <h5>
                  [{store.store.simple_address}] {store.store.category}
                </h5>
                <div>
                  <img src={review_icon} />
                  <h5>{store.reviews.length}</h5>
                </div>
              </div>
            </Col>
            <Col className='store-list-item-book'>
              <div className='book-btn'>
              <BmarkAdd size={20} storeId={store.store.id} />
                <h5>{store.store.store_cnt}</h5>
              </div>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};

export default StoreListItem;
