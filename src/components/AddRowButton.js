import React from 'react';
import PlusOne from '@material-ui/icons/PlusOne';

import MaterialButton from './MaterialButton';

const AddRowButton = props => (
  <MaterialButton {...props} leftIcon={PlusOne}>
    Row
  </MaterialButton>
);

export default AddRowButton;
