import {
  ADD_CONTACT,
  GET_CONTACTS,
  CONTACT_ERROR,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACT,
  CLEAR_FILTER,
  CLEAR_CONTACTS,
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case ADD_CONTACT:
      //vratit će postojeći state i za contacts
      // [... postojeći state i payload i funkc. addContact u State-u a to je
      // uneseni contact u ContactForm.js]
      return {
        ...state,
        contacts: [action.payload, ...state.contacts], //payload je preko axiosa i API-a poslan MongoDB
        //action.payload je ispred ...state da bi se novi prikazivao na početku
        loading: false,
      };
    case GET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        loading: false,
      };
    case UPDATE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact._id === action.payload._id ? action.payload : contact
        ),
        loading: false,
      };
    case DELETE_CONTACT:
      return {
        ...state,
        //filtrirat će state.contacts arr - za svaki contact u array-a vratiti samo one gdje id !=== id u payload-u
        contacts: state.contacts.filter(
          (contact) => contact._id !== action.payload //_id je iz MongoDB
        ),
        loading: false,
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload,
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null,
      };
    case FILTER_CONTACT:
      return {
        ...state,
        filtered: state.contacts.filter((contact) => {
          //filtriranje svih contact-a  u "contacts" array-u
          const regex = new RegExp(`${action.payload}`, 'gi'); //gi znači "global" i "insensitive - znači ne bitno da li su velika ili mala slova"
          return contact.name.match(regex) || contact.email.match(regex);
        }),
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null,
      };
    case CONTACT_ERROR:
      return {
        ...state,
        error: action.payload, //msg
      };
    case CLEAR_CONTACTS:
      return {
        ...state,
        contacts: null,
        current: null,
        filtered: null,
        error: null,
      };
    default:
      return state;
  }
};
