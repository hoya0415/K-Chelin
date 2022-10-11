import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import StoreListItem from '../Store/StoreListItem';
import { getBookmarkReccom } from '../../_action/book_action';


const UserReco = () => {
  const dispatch = useDispatch();
  const [dropValue, setDropValue] = useState('');
  const [page, setPage] = useState(1);
  const { storeList } = useSelector((state) => ({
    storeList: state.book.bookReccom,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const { access } = useSelector((state) => ({
    access: state.user.access,
  }));

  // 정렬 이벤트 핸들러
  const handleDrop = (value) => {
    setDropValue(value);
    setIsLoading(true)
    dispatch(getBookmarkReccom(access))
      .then((res) => {setIsLoading(false);})
      .catch((err) => console.log(err));
  };
  // 페이지네이션
  const handlePageChange = (e) => {
    setPage(e);
    setIsLoading(true)
    dispatch(getBookmarkReccom(access))
      .then((res) => {setIsLoading(false);})
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setPage(1)
    setIsLoading(false)
  }, [])

  return (
    <div className='reco-container'>
      <div>
        <div className='reco-sort'>
          <Dropdown onSelect={() => handleDrop()}>
            <Dropdown.Toggle variant='none'>정렬</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey='store_cnt'>인기순</Dropdown.Item>
              <Dropdown.Item eventKey='reviews_cnt'>리뷰순</Dropdown.Item>
              <Dropdown.Item eventKey='name_down'>이름순↓</Dropdown.Item>
              <Dropdown.Item eventKey='name_up'>이름순↑</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className='reco-store-list'>
        {storeList?.map((store, i) => (<StoreListItem key={i} store={store} isLoading={isLoading} />))}
      </div>
    </div>
  );
};

export default UserReco;