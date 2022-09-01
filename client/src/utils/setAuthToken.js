//ovde ćemo čekirati da li je token prošao iz loadUser() u AuthState-u
//ako jeste postavit ćemo ga uglobalni header kao axios.defaults.headers.common['x-auth.token'];
//tj postavit će se default for headers kao "token"
//to je potrebno pošto se bez toga user i isAuthnticated ponište  prilikom refresha i gubimo user-a u state-u
//ako nije brišemo tokene iz global headera

import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token; //x-auth-token' je KEY u Headers-u
  } else {
    delete axios.defaults.headers.common['x-auth-token']; //briše token iz Headers
  }
};

export default setAuthToken;
