import { React, useEffect, useState } from 'react';
import { Button, Modal, Form, Accordion } from 'react-bootstrap';
import plusbtn from '../../assets/plusbtn.png';
import forkplus from '../../assets/forkplus.png';
import { useDispatch, useSelector } from 'react-redux';
import { bookAdd, bookCreate, getBookList } from '../../_action/book_action';
import { getStoreDetail } from '../../_action/store_action';

const BmarkAdd = ({ size, storeId }) => {
  const dispatch = useDispatch();
  const { access, bookList } = useSelector((state) => ({
    access: state.user.access,
    bookList: state.book.bookList,
  }));
  // 리스트 추가 모달
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // 리스트 담기 완료 후 성공 모달
  const [successShow, setSuccessShow] = useState(false);
  const handleSuccessClose = () => setSuccessShow(false);


  // 북마크 리스트 불러오기
  const handleGetBookList = () => {
    dispatch(getBookList(access))
      .then()
      .catch((err) => console.log(err));
    setShow(true);
  };
  // 새 리스트 타이틀 입력 감지
  const [inputTitle, setInputTitle] = useState('');
  const handleInputChange = ({ target: { value } }) => {
    setInputTitle(value);
  };
  // 북마크 리스트 생성
  const handleBookCreate = () => {
    dispatch(bookCreate(access, inputTitle))
      .then()
      .catch((err) => console.log(err));
    setInputTitle('');
  };

  // 북마크에 담을 리스트 선택하기
  const [bookListIds, setBookListIds] = useState([]);
  const handleIds = (id) => {
    if (bookListIds.includes(id)) {
      setBookListIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookListIds((prev) => [...prev, id]);
    }
  };
  // 북마크에 담기
  const submitBookAdd = () => {
    dispatch(bookAdd(access, storeId, bookListIds))
      .then((res) => dispatch(getStoreDetail(storeId)))
      .catch((err) => console.log(err));
    setShow(false);
  };

  useEffect(() => {
    dispatch(getBookList(access))
      .then()
      .catch((err) => console.log(err));
  }, [dispatch]);

  return (
    <div className='book-modal'>
      <div className='fork-modal-open-btn'>
        <img
          src={forkplus}
          onClick={handleGetBookList}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>

      <Modal className='add-list' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> 리스트 </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {bookList?.map((bookListItem, i) => (
              <div key={i}>
                <Form.Check
                  id={i}
                  className='add-checkbox'
                  label={bookListItem.title}
                  onClick={() => handleIds(bookListItem.id)}
                />
              </div>
            ))}
          </Form>
          <div className='add-new-list-btn-div'>
            <Accordion flush defaultActiveKey=''>
              <Accordion.Item>
                <Accordion.Header className='add-new-list-btn'>
                  <img src={plusbtn} />새 리스트 만들기
                </Accordion.Header>
                <Accordion.Body>
                  <input
                    className='add-input'
                    placeholder='리스트 이름을 입력하세요'
                    maxLength='15'
                    required={true}
                    value={inputTitle}
                    name='title'
                    onChange={handleInputChange}
                    // 엔터 눌러도 제출되게 하기
                  ></input>
                  <Button
                    onClick={() => handleBookCreate()}
                    type='submit'
                    className='add-btn'
                  >
                    완료
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='add-btn'
            onClick={() => {
              submitBookAdd();
              setSuccessShow(true);
            }}
          >
            완료
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={successShow} onHide={handleSuccessClose}>
        <Modal.Header closeButton>
          <Modal.Title>포크 성공</Modal.Title>
        </Modal.Header>
        <Modal.Body>리스트에 넣기 성공!</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleSuccessClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BmarkAdd;
