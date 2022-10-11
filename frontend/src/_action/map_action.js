import { GET_MAP_LOCATION } from './types';



export function getMapLocaion(center) {
  return {
    type: GET_MAP_LOCATION ,
    payload: center,
  };
}