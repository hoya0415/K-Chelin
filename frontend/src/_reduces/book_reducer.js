import { BOOK_ADD, GET_BOOK_LIST, BOOK_CREATE, BOOK_UPDATE, BOOK_DELETE, GET_BOOKMARK_DETAIL, BOOK_MINUS, GET_BOOKMARK_RECCOM } from '../_action/types';

const initState = { bookList: [] };

export default function book(state = initState, action) {
  switch (action.type) {
    case BOOK_ADD:
      return state;
    case GET_BOOK_LIST:
      if (action.payload) {
        return {
          ...state,
          bookList: action.payload,
        };
      } else return state;
    case BOOK_CREATE:
      return {
        ...state,
        bookList: action.payload,
      };
    case BOOK_UPDATE:
      return {
        ...state,
        bookList: action.payload,
      };
    case BOOK_DELETE:
      return {
        ...state,
        bookList: action.payload,
      };

    case GET_BOOKMARK_DETAIL:
        return {
          ...state,
          bookDetail: action.payload,
        };
    case BOOK_MINUS:
      return {
        ...state,
      }
    case GET_BOOKMARK_RECCOM:
      return {
        ...state,
        bookReccom: action.payload,
      }
    default:
      return state;
  }
}
