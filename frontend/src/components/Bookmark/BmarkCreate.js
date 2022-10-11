import { React, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookCreate } from '../../_action/book_action';

const BmarkCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access } = useSelector((state) => ({
    access: state.user.access,
  }));
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [activeBtn, setActiveBtn] = useState(false);

  // 새 리스트 타이틀 입력 감지
  const [inputTitle, setInputTitle] = useState('');
  const handleInputChange = ({ target: { value } }) => {
    setInputTitle(value);
    if (value.length <= 0) {
      setActiveBtn(false);
    } else {
      setActiveBtn(true);
    }
  };
  // 북마크 리스트 생성
  const handleBookCreate = () => {
    dispatch(bookCreate(access, inputTitle))
      .then()
      .catch((err) => console.log(err));
    setInputTitle('');
    setShow(false);
  };

  return (
    <div>
      <Button className='modal-open-btn' onClick={handleShow}>
        {' '}
        + 새 리스트{' '}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton
          onHide={() => {
            setInputTitle('');
            setActiveBtn(false);
          }}
        >
          <Modal.Title> 리스트 만들기 </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className='add-input'
            required={true}
            value={inputTitle}
            placeholder='리스트 이름을 입력하세요'
            maxLength='15'
            onChange={handleInputChange}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='add-btn'
            type='submit'
            onClick={() => handleBookCreate()}
            disabled={!activeBtn}
          >
            {' '}
            완료{' '}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BmarkCreate;
