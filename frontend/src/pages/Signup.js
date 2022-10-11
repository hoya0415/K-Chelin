import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signupUser } from '../_action/user_action';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Typography,
  Backdrop,
  Box,
  TextField,
  Button,
} from '@mui/material';
import logo_sky_outline from '../assets/logo_sky_outline.png';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPasswordConfirm, setInputPasswordConfirm] = useState('');
  const [activeBtn, setActiveBtn] = useState(false); // 아이디, 비밀번호 유효성 검사 & 비밀번호 일치 여부
  const [activeId, setActiveId] = useState(null); // 아이디 유효성 검사
  const [activePw, setActivePw] = useState(null); // 비밀번호 유효성 검사
  const [open, setOpen] = useState(false); // 아이디 중복 경고 창 오픈 여부
  const handleClose = () => setOpen(false);

  // 회원가입 버튼 활성화 여부
  const onActiveBtn = () => {
    if (isSamePassword() && inputPasswordConfirm !== '') {
      if (inputId && activePw && activeId) {
        setActiveBtn(true);
      }
    }
  };
  // 아이디 유효성 검사
  const isId = (id) => {
    if (id.length > 3 && id.length < 13) {
      setActiveId(true);
    } else {
      setActiveId(false);
    }
  };

  // 비밀번호 유효성 검사
  const isPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    if (password) {
      setActivePw(passwordRegex.test(password));
    } else {
      setActivePw(true);
    }
  };
  // 아이디 입력 감지
  const onIdChange = (event) => {
    setInputId(event.target.value.trim());
    isId(event.target.value.trim());
  };
  // 비밀번호 입력 감지
  const onPasswordChange = (event) => {
    setInputPassword(event.target.value.trim());
    isPassword(event.target.value.trim());
  };
  const onPasswordChangeConfirm = (event) => {
    setInputPasswordConfirm(event.target.value.trim());
  };
  // {비밀번호 확인}과 {비밀번호}가 같은지 검사
  const isSamePassword = () => {
    if (inputPassword === inputPasswordConfirm || inputPasswordConfirm === '') {
      return true;
    } else {
      return false;
    }
  };
  // 회원가입 제출
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(signupUser(inputId, inputPassword, inputPasswordConfirm))
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });
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
    <div id='Account'>
      <div className='account-wrap'>
        <div>
          <div className='account-logo' alt='로고'>
            <img src={logo_sky_outline} />
          </div>
          {/* 회원가입 필드 */}
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
                <span className='err-msg'>영문 4 ~ 12 글자</span>
              ) : null}
              <TextField
                id='input'
                label='비밀번호'
                type='password'
                autoComplete='current-password'
                value={inputPassword || ''}
                onChange={onPasswordChange}
                onKeyUp={onActiveBtn}
              />
              {activePw === false ? (
                <span className='err-msg'>영어+숫자+특문 8 ~ 16 글자</span>
              ) : null}
              <TextField
                id='input'
                label='비밀번호 확인'
                type='password'
                autoComplete='current-password'
                value={inputPasswordConfirm || ''}
                onChange={onPasswordChangeConfirm}
                onKeyUp={onActiveBtn}
              />
              {isSamePassword() === false ? (
                <span className='err-msg'>비밀번호가 일치하지 않습니다</span>
              ) : null}
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
                회원가입
              </Button>
            </div>
            <div className='hr'></div>
            <div className='move-to-fld'>
              <span>이미 계정이 있으신가요? </span>
              <Link to='/' className='move-to'>
                로그인
              </Link>
            </div>
          </Box>

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
                  회원가입 실패
                </Typography>
                <Typography
                  id='modal-modal-description'
                  fontFamily='Aggro'
                  sx={{ mt: 2 }}
                >
                  이미 가입된 아이디입니다.
                </Typography>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
