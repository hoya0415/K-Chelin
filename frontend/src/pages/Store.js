import React, { useEffect, useState } from 'react';
import StoreInfo from '../components/Store/StoreInfo';
import StoreReview from '../components/Store/StoreReview';
import StoreSimilar from '../components/Store/StoreSimilar';
import { Tabs, Tab, Button } from 'react-bootstrap';
import BmarkAdd from '../components/Bookmark/BmarkAdd';
import Carousel from 'react-material-ui-carousel';
import { useSelector } from 'react-redux';
import { useNavigate,  } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Paper, Skeleton } from '@mui/material';
import logo_sky_back from '../assets/logo_sky_back.png';

const Store = () => {
  const navigate = useNavigate();

  const { storeDetail } = useSelector((state) => ({
    storeDetail: state.store.storeDetail,
  }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div>
      <div className='store-text'>
        <div className='header-btn'>
          <Button
            variant='link'
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBack fontSize='large' className='back-btn' />
          </Button>
        </div>
        <div>
          <h2>{storeDetail.store.store_name}</h2>
          <h4>
            [{storeDetail.store.simple_address}] {storeDetail.store.category}
          </h4>
        </div>
        <div className='store-fork'>
          <div style={{ margin: '5px', opacity: 0.7 }}>
            <BmarkAdd size={25} storeId={storeDetail.store.id} />
          </div>
          <h5>{storeDetail.store.store_cnt}</h5>
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
          },
        }}
      >
        {(storeDetail.imgs.length > 0) & (storeDetail.imgs[0] !== '') ? (
          storeDetail.imgs?.map((url, i) => (
            <Paper key={i} className='near-carousel-container'>
              <img src={url} className='near-carousel-img' />
            </Paper>
          ))
        ) : (
          <img src={logo_sky_back} className='near-carousel-img' />
        )}
      </Carousel>

      <div className='store-tab-con'>
        <Tabs defaultActiveKey='info' className='store-tabs'>
          <Tab eventKey='info' title='정보'>
            <StoreInfo store={storeDetail} />
          </Tab>
          <Tab eventKey='review' title={`리뷰 (${storeDetail.reviews?.length})`}>
            <StoreReview store={storeDetail} isLoading={isLoading} />
          </Tab>
          <Tab eventKey='store' title='비슷한 맛집'>
            <StoreSimilar />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Store;
