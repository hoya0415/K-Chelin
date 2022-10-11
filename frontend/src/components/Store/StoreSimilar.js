import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { Col, Row, Container, Button } from 'react-bootstrap';
import StoreItem from './StoreItem';
import { Skeleton } from '@mui/material';
import { getStoreDetail } from '../../_action/store_action';
import { useSelector, useDispatch } from 'react-redux';


const StoreSimilar = () => {
  const params = useParams();
  const [similarStore, setSimilarStore] = useState([])
  const handleSimilar = () => {
    axios({
      method: 'get',
      url: `http://j6d208.p.ssafy.io:5000/stores/${params.storeId}/similar/`,
      // url: `http://127.0.0.1:8000/stores/${params.storeId}/similar/`,
    })
      .then((res) => {
        // console.log(res)
        setSimilarStore(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    handleSimilar()
  }, [params.storeId]);

  return (
    <Container className='similar-container'>
      <Button onClick={handleSimilar}>새로고침</Button>
      <Row>
        {similarStore?.map((store, i) => (
          <Col xs={6} key={i}>
            <StoreSimilarItem store={store} size={130} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};


const StoreSimilarItem = ({ store, size }) => {
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
      <div className='store-item' style={{width:`${size}px`, height:`${size}px`}}>
        {/* <img src={store?.review_set[0]?.img_url} /> */}
        {isLoading ? (
          <Skeleton variant='rectangular' width={size} height={size} />
        ) : store?.review_set[0]?.img_url ? (
          <img src={store?.review_set[0]?.img_url} />
        ) : (
          <img src='https://ww.namu.la/s/8005b6932410c808e3e80ec6452d0f3a5303287d99e1d897aacdf175a44da36c5e5f7f73f82bc6617155a7b3787558093a366ed7509ee7de246278eed95e8270a245dd25494cdee712b4a50205c3ee4e28e10969e1d3fe1575e46e5e54fcb77d' />
        )}
        <div className='store-item-info' onClick={() => moveToDetail()}>
          <h4>{store?.store_name}</h4>
          <h5>{store?.category}</h5>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StoreSimilar;
