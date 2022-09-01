import React, { useState, useContext, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext'; //za dodavanje novih contacata

const ContactForm = () => {
  const contactContext = useContext(ContactContext);
  const { addContact, updateContact, current, clearCurrent } = contactContext;

  //postavljanje vrijednosti od "current" u formu
  useEffect(() => {
    if (current !== null) {
      //ako current postoji
      setContact(current); //postavi da umjesto praznih default polja bude current
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        type: 'personal',
      });
    }
  }, [contactContext, current]);
  //kod useEffect moramo navesti šta se mijenja (na čemu je effect) u ovom slučaju current ili contactContext

  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'personal',
  });

  const { name, email, phone, type } = contact;

  const onChange = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value }); //setovanje input polja pri unosu

  const onSubmit = (e) => {
    e.preventDefault();
    if (current === null) {
      //tj ako nije pritisnuto Edit
      addContact(contact); //funkcija za dodavanje novog kontakta u Reducer-u
    } else {
      updateContact(contact); //promjen kontakta
      //(contact) je ono što je u input formi
      //ponovno vraćanje vrijednosti na početno
      clearAll();
    }
  };

  const clearAll = () => {
    clearCurrent();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className='text-primary'>
        {' '}
        {current ? 'Edit Contact' : 'Add Contact'}{' '}
      </h2>
      <input
        type='text'
        placeholder='Name'
        name='name'
        value={name}
        onChange={onChange}
      />
      <input
        type='email'
        placeholder='Email'
        name='email'
        value={email}
        onChange={onChange}
      />
      <input
        type='text'
        placeholder='Phone'
        name='phone'
        value={phone}
        onChange={onChange}
      />
      <h5>Contact Type</h5>
      <input
        type='radio'
        name='type'
        value='personal'
        checked={type === 'personal'}
        onChange={onChange}
      />{' '}
      Personal {''}
      <input
        type='radio'
        name='type'
        value='professional'
        checked={type === 'professional'}
        onChange={onChange}
      />{' '}
      Professional {''}
      <div>
        <input
          type='submit'
          value={current ? 'Update Contact' : 'Add Contact'}
          className='btn btn-block btn-primary'
        />
      </div>
      {current && ( //ako current nije null - dodati će Clear button
        <div>
          <button className='btn btn-light btn-block' onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
