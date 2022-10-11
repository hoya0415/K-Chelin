import axios from 'axios';
import { LOGIN_USER, SIGNUP_USER, LOGOUT_USER,DELETE_USER } from './types';

const USER_URL = 'http://j6d208.p.ssafy.io:5000/accounts';
// const USER_URL = "http://127.0.0.1:8000/accounts";

export function loginUser(inputId, inputPassword) {
  const request = axios
    .post(`${USER_URL}/login/`, { username: inputId, password: inputPassword })
    .then((res) => res.data);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function signupUser(inputId, inputPassword, inputPasswordConfirm) {
  const request = axios
    .post(`${USER_URL}/signup/`, {
      username: inputId,
      password: inputPassword,
      password2: inputPasswordConfirm,
    })
    .then((res) => res.data);
  return {
    type: SIGNUP_USER,
    payload: request,
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}
export function deleteUser(access) {
  const request = axios
    .delete(`${USER_URL}/delete/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  return {
    type: DELETE_USER,
    payload: request,
  };
}
