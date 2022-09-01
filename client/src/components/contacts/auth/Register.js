import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../../context/alert/alertContext';
import AuthContext from '../../../context/auth/authContext';

const Register = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;

  const { register, error, clearErrors, isAuthenticated } = authContext; //funkcija register iz authState-a za regiser axios request prema backend-u i error (poruka)
  // ako postoji error u state-u onda će pokrenuti setAlert za alert obavijest
  useEffect(() => {
    if (isAuthenticated) {
      //ako je isAuthenticated:true
      props.history.push('/'); //redirektuje nas na '/' home stranicu
    }

    if (error === 'Korisnik već postoji') {
      setAlert(error, 'danger');
      //Alert će nestati nako 5 sek ali će error ostati u authState-u pa moramo pozvati clearErrors
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value }); //setovanje input polja pri unosu
  const onSubmit = (e) => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
      setAlert('Molimo popunite sva polja', 'danger');
    } else if (password !== password2) {
      setAlert('Password se ne podudara', 'danger');
    } else if (password.length < 6) {
      setAlert('Password mora imati najmanje  6 karaktera', 'danger');
    } else {
      //ako je sve ok pozivamo register funkciju i u njoj šaljemo "formData" objekt sa name email i password
      //formData podatci se preko const res = await axios.post("/api/users", formData, config); u authState register funkciji
      //šalju u backend users.js gdje se provjeravaju i gdje dobijamo token kao response
      register({
        // ovo je frormData
        name,
        email,
        password,
      });
    }
  };

  return (
    <div className='form-container'>
      <h1>
        Account <span className='text-primary'>Register</span>
      </h1>

      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input type='text' name='name' value={name} onChange={onChange} />
        </div>
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
        <div className='form-group'>
          <label htmlFor='password2'>Password Confirm</label>
          <input
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
          />
        </div>
        <input
          type='submit'
          value='Register'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  );
};

export default Register;
