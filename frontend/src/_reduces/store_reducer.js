import {
  GET_NEARBY_LIST,
  GET_STORE_DETAIL,
  GET_STORE_LIST,
  GET_SEARCH_LIST,
  GET_SEARCH_LIST_STORE,
  GET_SEARCH_LIST_PLACE,
  GET_HASH_LIST,
  SET_HASH_KEYWORD,
} from '../_action/types';

const initState = { storeList: [] };

export default function store(state = initState, action) {
  switch (action.type) {
    case GET_STORE_LIST:
      return {
        ...state,
        storeList: action.payload.storeList,
        storeSize: action.payload.storeSize,
      };
    case GET_NEARBY_LIST:
      return {
        ...state,
        nearbyList: action.payload.nearbyList,
        nearbyListSize: action.payload.nearbyListSize,
      };
    case GET_STORE_DETAIL:
      return {
        ...state,
        storeDetail: action.payload,
      };
    case GET_SEARCH_LIST:
      return {
        ...state,
        artistList: action.payload.storeList,
        artistListSize: action.payload.storeSize,
      };
    case GET_SEARCH_LIST_STORE:
      return {
        ...state,
        restoList: action.payload.storeList,
        restoListSize: action.payload.storeSize,
      };
    case GET_SEARCH_LIST_PLACE:
      return {
        ...state,
        placeList: action.payload.storeList,
        placeListSize: action.payload.storeSize,
      };
    case GET_HASH_LIST:
      return {
        ...state,
        hashList: action.payload,
      };
    case SET_HASH_KEYWORD:
      // console.log(action.payload)
      return {
        ...state,
        keyword: action.payload
      }
    default:
      return state;
  }
}
