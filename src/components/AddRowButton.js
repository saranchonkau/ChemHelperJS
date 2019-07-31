import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import PlusOne from '@material-ui/icons/PlusOne';

const AddRowButton = ({ onClick, disabled }) => (
  <StyledButton
    variant="contained"
    color="secondary"
    onClick={onClick}
    disabled={disabled}
  >
    <Icon />
    Row
  </StyledButton>
);

const StyledButton = styled(Button)`
  margin: 8px;
`;

const Icon = styled(PlusOne)`
  margin-right: 8px;
`;

AddRowButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default AddRowButton;
