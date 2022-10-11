import { GET_MAP_LOCATION } from '../_action/types';

const initState = {
  center: {
    lat: 35.8427721,
        lng: 129.2062821,
  },
};

export default function map(state = initState, action) {
  switch (action.type) {
    case GET_MAP_LOCATION:
      // console.log(action.payload)
      return {
        ...state,
        center: action.payload,
      };
    default:
      return state;
  }
}
