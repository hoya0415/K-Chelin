import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Modal, Typography, Backdrop, Slide } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../_action/user_action';
import logo_sky_outline from '../assets/logo_sky_outline.png';
import logo_sky_back from '../assets/logo_sky_back.png';

const Login = () => {
  // 변수
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [activeBtn, setActiveBtn] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [baseChecked, setBaseChecked] = useState(true);

  // 모달스타일
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    height: '150px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    boxShadow: 24,
    padding: '10%',
    opacity: '85%',
  };

  // 함수
  useEffect(() => {
    setTimeout(() => {
      setChecked(true);
      setBaseChecked(false);
    }, 2000);
  }, []);

  const handleClose = () => setOpen(false);

  const onActiveBtn = () => {
    if (
      inputId &&
      inputPassword &&
      inputPassword.trim().length >= 8 &&
      activeId
    ) {
      setActiveBtn(true);
    } else {
      setActiveBtn(false);
    }
  };

  const isId = (id) => {
    if (id.length > 3 && id.length < 13) {
      setActiveId(true);
    } else {
      setActiveId(false);
    }
  };

  const onIdChange = (event) => {
    setInputId(event.target.value.trim());
    isId(event.target.value);
  };
  const onPasswordChange = (event) => {
    setInputPassword(event.target.value.trim());
  };
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(inputId, inputPassword))
      .then((res) => {
        if (res.payload.access) {
          localStorage.setItem('jwt', res.payload.access);
          localStorage.setItem('userName', inputId);
          navigate('/main');
        }
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });
  };
  return (
    <div id='Account'>
      {/* 커버 페이지 */}
      <Slide in={baseChecked} direction='right'>
        <div className='cover-logo'><img src={logo_sky_back} /></div>
      </Slide>

      {/* 로그인 페이지 */}
      <Slide in={checked} direction='left'>
        <div className='account-wrap'>
          <div>
            {/* 로고 필드 */}
            <div className='account-logo' alt="로고">
              <img src={logo_sky_outline} />
            </div>

            {/* 로그인 필드 */}
            <Box
              onSubmit={onSubmit}
              component='form'
              noValidate
              autoComplete='off'
            >
              <div className='input-fld'>
                <TextField
                  autoFocus
                  id='input'
                  label='아이디'
                  value={inputId || ''}
                  onChange={onIdChange}
                  onKeyUp={onActiveBtn}
                />
                {activeId === false ? (
                  <span className='err-msg'>아이디 형식을 확인해주세요.</span>
                ) : (
                  false
                )}
                <TextField
                  id='input'
                  label='비밀번호'
                  type='password'
                  autoComplete='current-password'
                  value={inputPassword || ''}
                  onChange={onPasswordChange}
                  onKeyUp={onActiveBtn}
                />
                <Button
                  className='submit-btn'
                  style={{
                    background: activeBtn
                      ? 'linear-gradient(to right, #b9d1ea, #a7a1d8)'
                      : '#d8e0e4',
                    color: 'grey',
                    fontWeight: 'bold',
                    fontFamily: 'Aggro',
                  }}
                  disabled={!activeBtn}
                  type='submit'
                  variant='contained'
                >
                  로그인
                </Button>
              </div>

              <div className='hr'></div>

              <div className='move-to-fld'>
                <span>계정이 없으신가요? </span>
                <Link to='/signup' className='move-to'>
                  회원가입
                </Link>
              </div>
            </Box>

            {/* 모달 */}
            <div>
              <Modal
                open={open}
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
                    로그인 실패
                  </Typography>
                  <Typography
                    id='modal-modal-description'
                    fontFamily='Aggro'
                    sx={{ mt: 2 }}
                  >
                    계정 정보를 확인해주세요.
                  </Typography>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
};

export default Login;
