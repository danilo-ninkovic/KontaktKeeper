import React, { Fragment, useContext, useEffect } from 'react';
import Spinner from '../layout/Spinner';
//unutar ContactContext-a je global state
import ContactContext from '../../context/contact/contactContext';
import ContactItem from './ContactItem';

const Contact = () => {
  //inicijalizacija context-a, global state je sada u contactContext-u
  const contactContext = useContext(ContactContext);

  const { contacts, filtered, getContacts } = contactContext; //array kontakata u State-u

  useEffect(() => {
    //preko useEffect će aktivirati funkciju getContacts pri svakom loudovanju
    getContacts();
    // eslint-disable-next-line
  }, []);

  if (contacts !== null && contacts.length === 0) {
    //ako nema kontakata
    return <h4>Molimo unesite kontakt !</h4>;
  }

  return (
    <Fragment>
      {contacts !== null ? (
        filtered !== null ? (
          filtered.map((contact) => (
            <ContactItem key={contact._id} contact={contact} />
          ))
        ) : (
          contacts.map((contact) => (
            <ContactItem key={contact._id} contact={contact} />
          ))
        )
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

export default Contact;
