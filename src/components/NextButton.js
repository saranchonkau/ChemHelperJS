import React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Forward from '@material-ui/icons/ArrowForward';
import PropTypes from 'prop-types';

const NextButton = ({ onClick, disabled }) => (
  <StyledButton
    variant="contained"
    color="primary"
    onClick={onClick}
    disabled={disabled}
  >
    Next
    <Icon />
  </StyledButton>
);

const StyledButton = styled(Button)`
  margin: 8px;
`;

const Icon = styled(Forward)`
  margin-left: 8px;
`;

NextButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default NextButton;
