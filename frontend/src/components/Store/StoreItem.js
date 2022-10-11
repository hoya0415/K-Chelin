// 정사각형 가게 리스트
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getStoreDetail } from '../../_action/store_action';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import logo_sky_back from '../../assets/logo_sky_back.png';

const StoreItem = ({ store, size }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const moveToDetail = () => {
    dispatch(getStoreDetail(store.store.id))
      .then((res) => {
        navigate(`/store/${store.store.id}`);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    setIsLoading(false);
  });
  return (
    <div>
      <div
        className='store-item'
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {isLoading ? (
          <Skeleton variant='rectangular' width={size} height={size} />
        ) : (store.imgs?.length > 0) & (store.imgs[0] !== '') ? (
          <img src={store.imgs[0]} />
        ) : (
          <img src={logo_sky_back} />
        )}
        <div className='store-item-info' onClick={() => moveToDetail()}>
          <h4>{store.store.store_name}</h4>
          <h5>{store.store.category}</h5>
        </div>
      </div>
    </div>
  );
};

export default StoreItem;
