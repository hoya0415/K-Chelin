// 북마크 삭제 기능 필요할듯
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookUpdate, bookDelete } from '../../_action/book_action';
import '../../styles/_Bookmark.scss';
import map from '../../assets/map.png';
import { Dropdown } from 'react-bootstrap';
import { getBookmarkDetail } from '../../_action/book_action';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import logo_sky_back from '../../assets/logo_sky_back.png';
import {
  Modal,
  Typography,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';

const BmarkList = ({ bookItem }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access } = useSelector((state) => ({
    access: state.user.access,
  }));

  // bookListDetail로 이동
  const moveToList = () => {
    dispatch(getBookmarkDetail(access, bookItem.id))
      .then((res) => {
        // console.log(res);
        navigate(`/bookmark/${bookItem.id}`);
      })
      .catch((err) => console.log(err));
  };

  // 북마크 이름 수정
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(bookItem.title);
  const handleTitleChange = ({ target: { value } }) => {
    setUpdateTitle(value);
  };
  const handleBookUpdate = () => {
    dispatch(bookUpdate(access, bookItem.id, updateTitle));
    setIsUpdate(false);
  };

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
    dispatch(bookDelete(access, bookItem.id)).then((res) => console.log(res));
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
    borderRadius: '12px',
    boxShadow: 24,
    padding: '10%',
    opacity: '85%',
  };
  return (
    <div className='bmark-cardcontainer'>
      <div className='bmark-card'>
        <Card>
          <CardContent>

          <div className='bmark-item-img' onClick={moveToList}>
          {bookItem?.stores[0]?.review_set[0]?.img_url ? 
          <img src={bookItem?.stores[0]?.review_set[0]?.img_url}  />
          : <img src={logo_sky_back} />}
          </div>

            <div className='bmark-card-text-con col-5'  onClick={moveToList}>
              <div className='bmark-card-text' >
                {bookItem.title}
             </div>
              <div className='bmark-count'>
                <img src={map} height='10px' className='bmark-count-m '/>
                {bookItem?.stores?.length}
              </div>
            </div>
            <div className='card-icon'>
              <Dropdown
                drop='start'
                variant='secondary'
                onSelect={handleDrop}
                className='bmark-drop'
              >
                <Dropdown.Toggle variant='none'>
                  <MoreVertIcon />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {/* <Dropdown.Item
                    eventKey="수정"
                  >수정
                  </Dropdown.Item> */}
                  <Dropdown.Item eventKey='삭제'>삭제</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 모달 */}
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
            <Button
              className='delete-btn'
              variant='outline-danger'
              onClick={handleListDelete}
              fontFamily='Aggro'
            >
              삭제
            </Button>
            <Button className='delete-cancel-btn' onClick={handleClose}>
              취소
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default BmarkList;

// https://www.geeksforgeeks.org/how-to-create-more-options-in-reactjs/
// 수정,삭제
