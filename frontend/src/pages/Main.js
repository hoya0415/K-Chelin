import React, { useState } from 'react';
import HashBy from '../components/Main/HashBy';
import NearBy from '../components/Main/NearBy';
import UserBy from '../components/Main/UserBy';
import Search from '../components/Search/Search';

import {
  Box,
  Button,
  Menu,
  MenuItem,
  Modal,
  Typography,
  Backdrop,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { deleteUser, logoutUser } from '../_action/user_action';

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access } = useSelector((state) => ({
    access: state.user.access,
  }));

  // 유저 관련 FUNCTION
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    navigate('/');
  };
  const handleOpen = () => {
    setModalOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteUser(access))
      .then((res) => {
        setModalOpen(false);
        localStorage.clear();
        navigate('/');
      })
      .catch((err) => {
        setModalOpen(false);
        console.log(err);
      });
  };
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


  const moveToStoreList = () => {
    navigate('/recommend');
  }


  return (
    <div className='main'>
      <div className='main-search-box'>
        <div className='col-10'>
          <Search />
        </div>
        {/* 유저 아이콘 로그아웃, 회원탈퇴  */}
        <div className='col-2'>
          <Button
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <img
              src='https://cdn-icons-png.flaticon.com/128/3917/3917796.png'
              className='user-btn'
            />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem id='main-menu' onClick={logout}>
              로그아웃
            </MenuItem>
            <MenuItem id='main-menu' onClick={handleOpen}>
              회원탈퇴
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className='pick-container'>
        <div className='col-3'>
          <div className='pick-img'>
            <img src='https://dimg.donga.com/wps/NEWS/IMAGE/2020/08/21/102583646.1.jpg' />
          </div>
        </div>
        <div className='pick-text'>
          <h4>제니's Pick</h4>
          <h5>#제니야_여기젠나마싯다</h5>
        </div>
        <div className='pick-btn col-4'>
          <Link to ='/recommend' state={{mainArtist: '블랙핑크', isUserRecom: 'artist'}} 
          style={{textDecoration: 'none'}}>
          <Button>지금 확인하기</Button>
          </Link>
        </div>
      </div>
      <NearBy />
      <UserBy />
      <HashBy />
      <div>
        <Modal
          open={modalOpen}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
          onClose={handleClose}
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
              탈퇴하시겠습니까?
            </Typography>
            <div className='button-position'>
              <Button
                className='button-font'
                onClick={handleDelete}
                id='modal-modal-description'
                sx={{ mt: 2 }}
              >
                확인
              </Button>
              <Button
                className='button-font'
                onClick={() => setModalOpen(false)}
                id='modal-modal-description'
                sx={{ mt: 2 }}
              >
                취소
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Main;
