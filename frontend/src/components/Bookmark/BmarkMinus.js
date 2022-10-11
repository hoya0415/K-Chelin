import {React,useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import review_icon from '../../assets/review_icon.png';
import forkminus from '../../assets/forkminus.png'

import { Container, Row, Col } from 'react-bootstrap';
import { getStoreDetail } from '../../_action/store_action';
import {
    Modal,
    Typography,
    Backdrop,
    Box,
    Button,
    Card,CardContent
  } from '@mui/material';
  import { bookMinus, bookItem, getBookmarkDetail } from '../../_action/book_action';
import book from '../../_reduces/book_reducer';
import logo_sky_back from '../../assets/logo_sky_back.png';

const BmarkMinus = ({size, store }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const { access, bookDetail, lat1, lng1} = useSelector((state) => ({
        access: state.user.access,
        bookDetail: state.book.bookDetail,
        lat1: state.map.center.lat,
        lng1: state.map.center.lng,
      }));

      const handleDistance = () => {
      let radius = 6371
      let dlat = (store.store.lat-lat1) * Math.PI / 180
      let dlng = (store.store.lon-lng1) * Math.PI / 180
      let a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos((lat1 * Math.PI / 180)) * Math.cos((store.store.lat * Math.PI / 180)) * Math.sin(dlng/2) * Math.sin(dlng/2) 
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
      let d = radius * c
      setGetDistance(Math.round(d))
    }
    const [getDistance, setGetDistance] = useState()

    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    const [open, setOpen] = useState(false); 
    
    const handleBookMinus = () => {
        dispatch(bookMinus(access, store.store.id, params.bookListId))
          .then((res) => {
          // console.log(res)
          setShow(false)
          dispatch(getBookmarkDetail(access, params.bookListId))})
    };
    
    const moveToDetail = () => {
        dispatch(getStoreDetail(store.store.id))
        .then((res) => {
            // console.log(res);
            navigate(`/store/${store.store.id}`);
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
      handleDistance()
    }, [store]);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw',
        height: '150px',
        backgroundColor: '#ffffff',
        border: '2px solid white',
        borderRadius: '12px',
        boxShadow: 24,
        padding: '10%',
        opacity: '85%',
    };

  return (
      <div>
    <Container>
      <Row className='store-list-item'>
        <Col xs={3}>
          <div className='store-list-item-img'>
          {store.imgs?.length > 0 & store?.imgs[0] !== '' ? (
              <img src={store?.imgs[0]} />
            ) : (
              <img src={logo_sky_back} />
            )}
          </div>
        </Col>
        <Col xs={6} className='store-list-item-info' onClick={moveToDetail}>
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
        <Col xs={2} className='store-list-item-book' >
          <div className='book-minus-btn' >
            <img 
                src={forkminus}
                className='forkminus-img'
                onClick={() => handleShow()}
            />
            <h5>{store.store.store_cnt}</h5>
          </div>
          <Modal
                open={show}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
          >
            <Box style={modalStyle} className='modal-box'>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
                fontFamily='Aggro'
              >
                삭제하시겠습니까?
              </Typography>
            <div className='book-minus-btns'>
            <Button
              className='book-delete-btn'
              variant='outline-danger'
              onClick={handleBookMinus}
              fontFamily='Aggro'
              >삭제</Button>
            <Button
              className='book-delete-cancel-btn'
              onClick={handleClose}
            >취소</Button>
            </div>
            </Box>
          </Modal>
        </Col>
      </Row>
    </Container>
    <div>
          
        </div>
    </div>
  );
}

export default BmarkMinus