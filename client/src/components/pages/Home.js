import React, { useContext, useEffect } from 'react';
import Contact from '../contacts/Contact';
import ContactForm from '../contacts/ContactForm';
import ContactFilter from '../contacts/ContactFilter';
import AuthContext from '../../context/auth/authContext';

const Home = () => {
  const authContext = useContext(AuthContext);
  //useEffect znači pri svakom loaded komponenete
  useEffect(() => {
    authContext.loadUser(); //pozivamo ovu funkciju pošto bez nje gubimo user-a i isAuthenticated iz authState-a prilikom refreša
    // eslint-disable-next-line
  }, []);

  return (
    <div className='grid-2'>
      <div>
        <ContactForm />
      </div>
      <div>
        <ContactFilter />
        <Contact />
      </div>
    </div>
  );
};

export default Home;
