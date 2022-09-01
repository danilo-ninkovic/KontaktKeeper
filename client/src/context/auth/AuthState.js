import React, { useReducer } from 'react'; //useReducer hook
import axios from 'axios'; //za request

import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
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

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem('token'), //token će biti u localStorage-u
    isAuthenticated: null, //da li je user logovan ili ne
    loading: true, //za spiner (umjesto false-true-false, ovaj put true- pa false nako response)
    user: null, // da znamo sa kojim user-om raspolažemo
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //Load User (čekiranje koji user je loged- in u uzimanje potrebnih podataka)
  const loadUser = async () => {
    if (localStorage.token) {
      //ako postoji token u localStorage-u
      setAuthToken(localStorage.token);
    } //postavljanje token-a u global headers preko setAuthToken, istu funkciju moramo postaviti i u glavnu app.js

    try {
      const res = await axios.get('/api/auth'); //ovaj API čekira token
      //ako je token OK
      dispatch({
        type: USER_LOADED,
        payload: res.data, //user
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR }); //(poništvanje token-a i clear everithing)
    }
  };

  // Register User (sign user-a i dobijanje token-a)
  const register = async (formData) => {
    const config = {
      //slanjem POST request-a šaljemo neme podatke te nam je potreban taj Content-Type iz hedera od post req
      //da serveru kažemo kakav je tip podataka, mada će raditi i bez ovoga
      headers: {
        'Content-Type': 'application/json',
      },
    };
    //zatim ispod config-a šaljemo axios req. prema backend routu gdje unutar users.js kao res šalje kriptovani token u header-u
    try {
      const res = await axios.post('/api/users', formData, config); //axios request prema "proxy": "http://localhost:5000"/api/users - formdata su (name-email-password) iz Register.js
      //ako axios.post uspije onda postavljamo:
      dispatch({
        type: REGISTER_SUCCES,
        payload: res.data, // token iz users.js
      });
      loadUser(); // ako je rigistracija uspjela onda u loadUser() postavljamo glob token i šaljemo user-a u payload
    } catch (err) {
      //eror je u stvari u backend users.js "return res.status(400).json({ poruka: "Korisnik već postoji" });"
      dispatch({
        type: REGISTER_FAIL, //(poništvanje token-a i clear everithing)
        payload: err.response.data.poruka, //korisnik već postoji
      });
    }
  };

  // Login User (logovanje registrovanog user-a i dobijanje tokena)
  const login = async (formData) => {
    //formData si email i password
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/auth', formData, config); //axios request prema "proxy": "http://localhost:5000"/api/auth - formdata su (email-password) iz Login.js
      //ako axios.post uspije onda postavljamo:
      dispatch({
        type: LOGIN_SUCCES,
        payload: res.data, // token iz auth.js
      });
      loadUser(); // ako je logovanje uspjelo onda u loadUser() postavljamo glob token i šaljemo user-a u payload
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL, //(poništvanje token-a i clear everithing)
        payload: err.response.data.poruka, //return res.status(400).json({ poruka: 'Nemate ovlaštenje za pristup' }); U auth.js
      });
    }
  };

  //Logout (poništvanje token-a i clear everithing)
  const logout = () => dispatch({ type: LOGOUT });

  //Clear Errors (poništvanje token-a i clear everithing)
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
