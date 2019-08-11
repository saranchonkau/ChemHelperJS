import React from 'react';
import Forward from '@material-ui/icons/ArrowForward';

import MaterialButton from './MaterialButton';

const NextButton = props => (
  <MaterialButton {...props} color="primary" rightIcon={Forward}>
    Next
  </MaterialButton>
);

export default NextButton;
