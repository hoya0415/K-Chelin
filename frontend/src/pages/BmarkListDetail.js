import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Tab, Button } from 'react-bootstrap';
import {getBookmarkDetail, bookUpdate, bookDelete } from '../_action/book_action'
import {Card,CardContent} from '@mui/material';
import StoreListItem from '../components/Store/StoreListItem';
import BmarkMinus from '../components/Bookmark/BmarkMinus';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Dropdown } from 'react-bootstrap';
import review_icon from '../assets/review_icon.png';
import BmarkAdd from '../components/Bookmark/BmarkAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Container, Row, Col } from 'react-bootstrap';
import {
  Modal,
  Typography,
  Backdrop,
  Box,
} from '@mui/material';

const BmarkListDetail = ({ bookItem }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  console.log(params)

  const { bookList, access, bookDetail } = useSelector((state) => ({
    bookDetail: state.book.bookDetail,
    bookList: state.book.bookList,
    access: state.user.access,
  }));

  // 북마크 이름 수정
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(bookDetail.title);
  const handleTitleChange = ({ target: { value } }) => {
    setUpdateTitle(value);
  };
  const handleBookUpdate = () => {
    dispatch(bookUpdate(access, params.bookListId, updateTitle))
    setIsUpdate(false)
  }

  // 북마크 리스트 삭제
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleDrop = (value) => {
    if (value === '수정') {
      setIsUpdate(true);
    } else {
      // 삭제하시겠습니까 모달 띄우기!
      setOpen(true);
    }
  };
  const handleListDelete = () => {
    dispatch(bookDelete(access, params.bookListId))
      .then(navigate(`/bookmark`))
    setOpen(false);
  };

   // 모달 스타일 선언
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
      <div className='list-header'>
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
        <div className='list-name'>
        <input
                className='bmark-detail-title'
                onChange={handleTitleChange}
                value={updateTitle}
                placeholder={bookDetail.title}
                readOnly={!isUpdate}
                maxLength={10}
                
              ></input>
              {isUpdate ? <button className='bmark-detail-update-btn' type="submit" onClick={ handleBookUpdate }>수정</button> : ''}
        </div>

        <div className='detail-header-icon'>
           <Dropdown
              drop="start"
              variant="secondary"
                onSelect={handleDrop}
              className='bmark-drop'
              >
                <Dropdown.Toggle variant='none' ><MoreVertIcon /></Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    eventKey="수정"
                  >수정
                  </Dropdown.Item>
                  <Dropdown.Item 
                  eventKey="삭제"
                  >삭제
                  </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </div>
      </div>
      <div>
          <Modal
            open={open}
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
            <div className='delete-btns'>
              <Button
                className='delete-btn'
                variant='outline-danger'
                onClick={handleListDelete}
                >삭제</Button>
              <Button
                className='delete-cancel-btn'
                onClick={handleClose}
              >취소</Button>
            </div>
            </Box>
          </Modal>
        </div>
        
      <div>
        {bookDetail.stores.map((store, i) => (
          <BmarkMinus key={i} store={store} />
        ))}
      </div>
    </div>
  );
};

export default BmarkListDetail;
