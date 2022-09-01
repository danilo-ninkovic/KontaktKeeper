import React, { Fragment } from 'react';
import spinner from './spinner.gif'; //lokacija spinner-a

export const Spinner = () => (
  <Fragment>
    <img
      src={spinner} //spinner gif
      alt='Loading...'
      style={{ width: '200px', margin: 'auto', display: 'block' }}
    />
  </Fragment>
);

export default Spinner;
