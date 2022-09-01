import {
  REGISTER_SUCCES,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCES,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload, //User
      };
    case REGISTER_SUCCES:
    case LOGIN_SUCCES:
      //u oba slušaja payload šalje token
      //prvo token iz payloada šaljemo u localStorage gdje ostaje za stalno
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload, //token
        isAuthenticated: true, //pošto je token uredan
        loading: false, //da prekine spiner
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token'); //uklanjanje token iz localStorage
      return {
        //vraćamo uglavnom na početni state osim error
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload, //poruka
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null, //poništava error koji je ostao u authState-a
      };
    default:
      return state;
  }
};
