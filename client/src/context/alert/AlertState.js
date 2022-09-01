import React, { useReducer } from 'react'; //useReducer hook
import { v4 as uuid } from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERT, REMOVE_ALERT } from '../types';

const AlertState = (props) => {
  const initialState = []; //array of alert objects

  const [state, dispatch] = useReducer(alertReducer, initialState);

  //set Alert
  const setAlert = (msg, type, timeaut = 5000) => {
    //msg type id su u komponenti Alert
    const id = uuid(); //random id for array elements
    dispatch({
      // to alertReducer
      type: SET_ALERT,
      payload: { msg, type, id },
    });
    setTimeout(
      () =>
        dispatch({
          type: REMOVE_ALERT,
          payload: id,
        }),
      timeaut //nakon 5 sekundi aktivirat će se Remove_alert
    );
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state, //čitav state alerts []
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
