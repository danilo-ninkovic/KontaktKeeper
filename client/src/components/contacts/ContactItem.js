import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ContactContext from '../../context/contact/contactContext';

//ova komponenta će biti unutar contact.map() u Contact.js i povlači "contact" prop  za svaki pojedinačni contact
const ContactItem = ({ contact }) => {
  const contactContext = useContext(ContactContext);
  const { deleteContact, setCurrent, clearCurrent } = contactContext;

  const { _id, name, phone, email, type } = contact;

  const onDelete = () => {
    deleteContact(_id); //briše kontakt preko id-a (uzima id od kliknutog jer je ovo fajl za  jedan kontakt)
    clearCurrent(); //čisti polja za setovanje postojećeg "current" u kontakt formi
  };

  return (
    <div className='card bg-light '>
      <h3 className='text-primary text-left'>
        {' '}
        {name}
        {''}{' '}
        <span
          style={{ float: 'right' }}
          className={
            'badge ' + //mora space poslije zadnjeg slova
            (type === 'professional' ? 'badge-success' : 'badge-primary')
          }
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </h3>

      <ul className='List'>
        {email && (
          <li>
            <i className='fas fa-envelope-open'></i> {email}
          </li>
        )}
        {phone && (
          <li>
            <i className='fas fa-phone'></i> {phone}
          </li>
        )}
      </ul>

      <button
        className='btn btn-dark btn-sm'
        onClick={() => setCurrent(contact)}
      >
        Edit
      </button>
      <button className='btn btn-danger btn-sm' onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
};

export default ContactItem;
