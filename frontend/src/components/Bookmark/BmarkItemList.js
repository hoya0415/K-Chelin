import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const BmarkItemList = ({store}) => {
  const navigate = useNavigate();

  const moveToDetail = () => {
    navigate(`/store/${store.id}`);
  };

  return (
    <Container onClick={moveToDetail}>
      <Row className='store-list-item'>
        <Col xs={3}>
          <div className='store-list-item-img'>
            <img src={store.thumb} />
          </div>
        </Col>
        <Col xs={6} className='store-list-item-info'>
          <h4>{store.name}</h4>
          <h5>{store.category}</h5>
          <div className='store-list-item-tag-container'>
            {store.tags.map((tag, i) => (
              <div key={i} className='store-list-item-tag'>
                #{tag}
              </div>
            ))}
          </div>
        </Col>
        <Col xs={2} className='store-list-item-book'>
          <h5>거리{store.distance}km</h5>
          <h5>북마크{store.bookmarkCnt}</h5>
          <h5>리뷰{store.reviewCnt}</h5>
        </Col>
      </Row>
    </Container>
  );
}

export default BmarkItemList