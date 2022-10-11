import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getStoreDetail } from '../../_action/store_action';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import logo_sky_back from '../../assets/logo_sky_back.png';

const HashBy = () => {
  const { access } = useSelector((state) => ({
    access: state.user.access,
  }));

  const [similarHash, setSimilarHash] = useState([]);

  const handleHashBy = () => {
    axios({
      method: 'get',
      url: 'http://j6d208.p.ssafy.io:5000/bookmarks/hashtag/similar/',
      // url: 'http://127.0.0.1:8000/bookmarks/hashtag/similar/',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        setSimilarHash(res.data);
        // console.dir(res.data[0].stores[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleHashBy();
  }, []);

  return (
    <div className='hash'>
      <div className='near-text'>
        <div className='near-title'>#맛집_그대여_당신은_어디에</div>
        <div className='near-subtitle'>
          좋아하는 아티스트의 찐맛집만 모아모아
        </div>
      </div>
      {similarHash?.map((hash, i) => (
        <div key={i} className={ i % 2 === 0 ? 'hash-container hash-back-red' : 'hash-container hash-back-pink'}>
          <div className='hash-title'>
            <h2># {hash.hashtag}</h2>
          </div>
          <div className='hash-store-container'>
            {hash.stores.map((store, i) => (
              <div key={i} className='hash-store'>
                <HashItem store={store} size={120} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const HashItem = ({ store, size }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const moveToDetail = () => {
    dispatch(getStoreDetail(store.id))
      .then((res) => {
        // console.log(res);
        navigate(`/store/${store.id}`);
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
        ) : store?.review_set[0]?.img_url ? (
          <img src={store?.review_set[0]?.img_url} />
        ) : (
          <img src={logo_sky_back} />
        )}
        <div className='store-item-info' onClick={() => moveToDetail()}>
          <h4>{store?.store_name}</h4>
          <h5>{store?.category}</h5>
        </div>
      </div>
    </div>
  );
};

export default HashBy;
