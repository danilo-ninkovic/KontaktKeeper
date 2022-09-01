import React, { useContext, useRef, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactFilter = () => {
  const contactContext = useContext(ContactContext);
  const { filterContacts, clearFilter, filtered } = contactContext;
  const text = useRef(""); //ref text u inputu se koristi preko useRef
  //useRef se koristi za jednostavnije inpute umjesto useState-a
  useEffect(() => {
    if (filtered === null) {
      text.current.value = "";
    } //brisanje filter text-a nakon filter-a
  });

  const onChange = (e) => {
    if (text.current.value !== "") {
      //ako je nešto upisano u input
      filterContacts(e.target.value); //pozivamo funkciju iz global state-a za filtriranje contacts-a
      //e.target.value je uneseni text
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input
        ref={text}
        type='text'
        placeholder='Filter Contacts ...'
        onChange={onChange}
      />
    </form>
  );
};

export default ContactFilter;
