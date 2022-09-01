import React, { useReducer } from 'react'; //useReducer hook
import axios from 'axios'; // za backend  API request
import contactContext from './contactContext';
import contactReducer from './contactReducer';
import {
  ADD_CONTACT,
  GET_CONTACTS,
  CONTACT_ERROR,
  DELETE_CONTACT,
  CLEAR_CONTACTS,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACT,
  CLEAR_FILTER,
} from '../types';

const ContactState = (props) => {
  const initialState = {
    contacts: null, // bit će poslijearray od contacata (name,email,phone,type)
    current: null, //ovo će se puniti nekim contact {} kojem treba set(edit) iz ContactItem.js
    filtered: null, //na osnovu text-a filtrirani "contacts" array
    error: null,
  };
  //slijedeći korak je povezivanje state-a sa reducer-om
  //initialState je sada state i preko dispatch-a se povezuje sa cintactReducer-om
  const [state, dispatch] = useReducer(contactReducer, initialState);

  //Get contacts (da ih vidimo u browseru  iz MongoDB-a)
  const getContacts = async () => {
    try {
      const res = await axios.get('/api/contacts'); //request prema API-u da dobijemo contacte iz baze  ubrowser
      //token je već postavljen globaly prilikom logovanja User-a pomoću 'setAuthToken.js' fajla, pa ga sad ne moramo povlačiti
      dispatch({ type: GET_CONTACTS, payload: res.data }); //data su contacts[] u mongoDB
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.message });
    }
  };

  //Add Contact (dodavanje novog contact-a u bazu)
  const addContact = async (contact) => {
    const config = {
      headers: {
        //pošto šaljemo podatke,treba nam tip podataka
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post('/api/contacts', contact, config); //request prema API-u šaljemo uneseni contact i tip podataka
      //token je već postavljen globaly prilikom logovanja User-a pomoću 'setAuthToken.js' fajla, pa ga sad ne moramo povlačiti
      dispatch({ type: ADD_CONTACT, payload: res.data }); //data je contact iz routes/contacts.js unesen u   ContactForm.js
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.message });
    }
  };

  //Delete Contact
  const deleteContact = async (id) => {
    try {
      await axios.delete(`/api/contacts/${id}`); //pozivanje "router.delete('/:id', auth, async (req, res) => {" u route/contacts.js da obriše dokument preko id-a
      dispatch({ type: DELETE_CONTACT, payload: id }); //deleteContact je iz ContactItem.js
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.message });
    }
  };

  //Update Contact
  const updateContact = async (contact) => {
    const config = {
      headers: {
        //pošto šaljemo podatke,treba nam tip podataka
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.put(
        `/api/contacts/${contact._id}`, // pozivanje router.put('/:id', auth, async (req, res) => { u router/contacts.js da promijeni contact preko id-a
        contact, //objekat za promjenu
        config //tip post podataka
      ); //request prema API-u šaljemo uneseni contact i tip podataka
      //token je već postavljen globaly prilikom logovanja User-a pomoću 'setAuthToken.js' fajla, pa ga sad ne moramo povlačiti
      dispatch({ type: UPDATE_CONTACT, payload: res.data }); //payload je podaci iz res-a a to je "contactById = await Contact.findByIdAndUpdate("
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.message });
    }
  };

  //Set Curent Contact (na Edit u ContactItem-u samo setuje "current" iz global state-a
  // samo mu daje vrijednost ali ga ne prikazuje)
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact }); //edit za Contact iz ContactItem.js
  };

  //Clear Current Contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT }); //vraćanje current : null
  };

  //Filter Contacts
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACT, payload: text }); //filtriranje na osnovu text-a
  };

  //Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER }); //vraćanje filtered : null
  };

  //clearContacts (vraća contact state na početno da ne ostaju pri logoutu jer će bljesbuti nekome drugom pri pokretanju aplikacije)
  const clearContacts = () => {
    dispatch({ type: CLEAR_CONTACTS });
  };

  //return je contactContects.Provider koji će obuhvatiti cijelu App
  //preko ove ContactState funkcije
  return (
    <contactContext.Provider
      // value {{}} postaju dio contactContext-a (koji je prazan samo je kreiran Context)
      // i za to se on i poziva u ostale komponenete
      //gdje su potrebni ti parametri i metode
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact, //pozvana u <ContactForm />
        deleteContact, //pozvana u <ContaciItem />
        setCurrent, //pozvana u <ContaciItem />
        clearCurrent, //pozvana u <ContactForm /> <ContaciItem />
        updateContact, //pozvana u <ContactForm />
        filterContacts, //pozvana u <ContactFilter/>
        clearFilter, //pozvana u <ContactFilter/>
        getContacts, //pozvana u <Contact/>
        clearContacts,
      }}
    >
      {props.children /*ovo je ono u <Router /> u App.js*/}
    </contactContext.Provider>
  );
};

export default ContactState;
