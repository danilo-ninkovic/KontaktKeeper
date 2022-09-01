import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../../context/alert/alertContext';
import AuthContext from '../../../context/auth/authContext';

const Login = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;
  const { login, error, clearErrors, isAuthenticated } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      //ako je isAuthenticated:true
      props.history.push('/'); //redirektuje nas na '/' home stranicu
    }

    if (error) {
      setAlert(error, 'danger');
      //Alert će nestati nako 5 sek ali će error ostati u authState-u pa moramo pozvati clearErrors
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value }); //setovanje input polja pri unosu
  const onSubmit = (e) => {
    e.preventDefault();
    //pozivanje metode iz state-a,  za registraciju
    if (email === '' || password === '') {
      setAlert('Molimo unesite mail i password', 'danger');
    }
    login({
      // ovo je frormData
      email,
      password,
    });
  };

  return (
    <div className='form-container'>
      <h1>
        Account <span className='text-primary'>Login</span>
      </h1>

      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email Adress</label>
          <input type='email' name='email' value={email} onChange={onChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
          />
        </div>

        <input
          type='submit'
          value='Login'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  );
};

export default Login;
