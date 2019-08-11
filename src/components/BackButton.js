import React from 'react';
import Back from '@material-ui/icons/ArrowBack';

import MaterialButton from './MaterialButton';

const BackButton = props => (
  <MaterialButton {...props} leftIcon={Back}>
    Back
  </MaterialButton>
);

export default BackButton;
