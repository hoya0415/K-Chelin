import { LOGIN_USER, SIGNUP_USER, LOGOUT_USER, DELETE_USER } from '../_action/types';

const initState = {};

export default function user(state = initState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        access: action.payload.access,
      };
    case LOGOUT_USER:
      return initState; 
    case DELETE_USER:
      return initState; 
    case SIGNUP_USER:
      return { ...state, signupMsg: action.payload.message };
    default:
      return state;
  }
}
