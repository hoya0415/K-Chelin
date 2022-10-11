import axios from "axios";
import { BOOK_ADD, BOOK_CREATE, GET_BOOK_LIST, BOOK_UPDATE, BOOK_DELETE,  GET_BOOKMARK_DETAIL, BOOK_MINUS, GET_BOOKMARK_RECCOM } from "./types";

const BOOK_URL = "http://j6d208.p.ssafy.io:5000/bookmarks";
// const BOOK_URL = "http://127.0.0.1:8000/bookmarks";

export function bookAdd(access, storeId, bookListIds) {
  // console.log(access, storeId, bookListIds)
  const request = axios
    .post(
      `${BOOK_URL}/add/store/${storeId}/`,
      { id: bookListIds },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: BOOK_ADD,
    payload: request,
  };
}
export function getBookList(access) {
  const request = axios
    .get(`${BOOK_URL}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_BOOK_LIST,
    payload: request,
  };
}
export function bookCreate(access, inputTitle) {
  const request = axios
    .post(
      `${BOOK_URL}/`,
      { title: inputTitle },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: BOOK_CREATE,
    payload: request,
  };
}
export function bookUpdate(access, bookListId, updateTitle) {
  const request = axios
    .put(
      `${BOOK_URL}/${bookListId}/`,
      { title: updateTitle },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: BOOK_UPDATE,
    payload: request,
  };
}

export function bookDelete (access, bookListId) {
  const request = axios
    .delete(
      `${BOOK_URL}/${bookListId}/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: BOOK_DELETE,
    payload: request,
  };
}

export function getBookmarkDetail(access, bookListId) {
  const request = axios
    .get(`${BOOK_URL}/${bookListId}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_BOOKMARK_DETAIL,
    payload: request,
  };
}

export function bookMinus(access, storeId, bookDetail) {
  const request = axios
    .post(
      `${BOOK_URL}/del/store/${bookDetail}/`,
      { id: [storeId] },
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: BOOK_MINUS,
    payload: request,
  };
}

export function getBookmarkReccom(access) {
  const request = axios
    .get(
      `${BOOK_URL}/recommendation/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    )
    .then((res) => res.data);
  return {
    type: GET_BOOKMARK_RECCOM,
    payload: request,
  };
}