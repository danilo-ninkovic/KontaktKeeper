import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';
import ContactContext from '../../context/contact/contactContext';

const Navbar = ({ title, icon }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;

  const contactContext = useContext(ContactContext);
  const { clearContacts } = contactContext; //za brisanje contacata iz state prilikom logout-a da s e ne pojavljuju negdje pri pokretanju aplikacije

  const onLogout = () => {
    logout();
    clearContacts(); //čisti contact state
  };

  const authLinkovi = (
    <Fragment>
      <li>Hello {user && user.name} </li>
      <li>
        <a href='#!' onClick={onLogout}>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const guestLinkovi = (
    <Fragment>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
      <li>
        <Link to='/about'>About</Link>
      </li>
    </Fragment>
  );

  return (
    <div className='navbar bg-primary'>
      <h1>
        <i className={icon} /> {title}
      </h1>
      <ul>{isAuthenticated ? authLinkovi : guestLinkovi}</ul>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

//defaulti za title i icon da se ne moraju ručno upisivati
Navbar.defaultProps = {
  title: 'Kontakt Keeper',
  icon: 'fas fa-id-card-alt',
};

export default Navbar;
