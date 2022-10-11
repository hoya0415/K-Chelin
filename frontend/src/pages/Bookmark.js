import {React, useEffect} from "react";
import BmarkAdd from "../components/Bookmark/BmarkAdd";
import BmarkCreate from "../components/Bookmark/BmarkCreate";
import BmarkList from "../components/Bookmark/BmarkList";
import { useDispatch, useSelector } from 'react-redux';
import {getBookList, bookCreate,} from '../_action/book_action'


const Bookmark = () => {
  const dispatch = useDispatch();
  const { access, bookList } = useSelector((state) => ({
    access: state.user.access,
    bookList: state.book.bookList,
  }));
  useEffect(() => {
    dispatch(getBookList(access))
      .then()
      .catch((err) => console.log(err));
  }, [dispatch]);


  return (
    <div className="bmark-container">
      <div className="bmark-pgname"> 포크 </div>
      <hr></hr>
      
      <BmarkCreate />
      {bookList?.map((item, i) => (
        <BmarkList key={i} bookItem={item} />
      ))}
    </div>
  );
};

export default Bookmark;
