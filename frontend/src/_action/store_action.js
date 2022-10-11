import axios from 'axios';
import {
  GET_STORE_LIST,
  GET_STORE_DETAIL,
  GET_NEARBY_LIST,
  GET_SEARCH_LIST,
  GET_SEARCH_LIST_STORE,
  GET_SEARCH_LIST_PLACE,
  GET_HASH_LIST,
  SET_HASH_KEYWORD,
} from './types';

const STORE_URL = 'http://j6d208.p.ssafy.io:5000/stores';
// const STORE_URL = 'http://127.0.0.1:8000/stores';

export function getStoreList(filterType, filterList, sortType, page) {
  // console.log(filterType, filterList, sortType, page);
  const request = axios
    .get(`${STORE_URL}/`, {
      params: {
        filter_type: filterType,
        filter_list: filterList,
        sort_type: sortType,
        page: page,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_STORE_LIST,
    payload: request,
  };
}
export function getStoreDetail(storeId) {
  const request = axios.get(`${STORE_URL}/${storeId}/`).then((res) => res.data);
  return {
    type: GET_STORE_DETAIL,
    payload: request,
  };
}

export function getNearbyList(lat, lng) {
  // console.log(lat, lng)
  const request = axios
    .get(`${STORE_URL}/nearby/`, {
      params: {
        lat: lat,
        lng: lng,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_NEARBY_LIST,
    payload: request,
  };
}

export function getSearchList(keyword, page) {
  const request = axios
    .get(`${STORE_URL}/search/3/`, {
      params: {
        keyword: keyword,
        page: page,
      },
    })
    .then((res) => res.data)
    // .then(res=>console.log(res.data.storeList))
    .catch((err) => console.log(err));
  return {
    type: GET_SEARCH_LIST,
    payload: request,
  };
}

export function getSearchListStore(keyword, page) {
  const request = axios
    .get(`${STORE_URL}/search/1/`, {
      params: {
        keyword: keyword,
        page: page,
      },
    })
    .then((res) => res.data)
    // .then(res=>console.log(res.data.storeList))
    .catch((err) => console.log(err));
  return {
    type: GET_SEARCH_LIST_STORE,
    payload: request,
  };
}

export function getSearchListPlace(keyword, page) {
  const request = axios
    .get(`${STORE_URL}/search/2/`, {
      params: {
        keyword: keyword,
        page: page,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_SEARCH_LIST_PLACE,
    payload: request,
  };
}

export function getHashList(value) {
  const request = axios
    .get(`${STORE_URL}/hashtag/${value}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: GET_HASH_LIST,
    payload: request,
  };
}

export function setHashKeyword(inputKeyword) {
  return {
    type: SET_HASH_KEYWORD,
    payload: inputKeyword,
  };
}
