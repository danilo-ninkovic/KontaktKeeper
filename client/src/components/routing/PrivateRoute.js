//preko PrivateRouta će ići stranica za koju treba prethodno logovanje
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
//preko authContext-a provjeravamo da li je logovan
//da li je isAuthenticated:true i

//Standardni način kreiranja private rout-a
const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext; //provjera iz context-a
  return (
    //Standardni način kreiranja private rout-a
    <Route
      {...rest} //ostatak propertia
      render={(props) =>
        !isAuthenticated && !loading ? ( //ako nema autentifikaciju i završio je loading
          <Redirect to='/login' /> //vratit će nas na Login stranicu
        ) : (
          <Component {...props} /> //ako ima nastavit će dalje gdje smo mu zadali u kodiranju
        )
      }
    />
  );
};

export default PrivateRoute;
