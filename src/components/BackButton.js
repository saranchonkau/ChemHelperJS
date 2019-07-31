import React from 'react';
import Button from '@material-ui/core/Button';
import Back from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const BackButton = ({ onClick, disabled }) => (
  <StyledButton
    variant="contained"
    color="secondary"
    onClick={onClick}
    disabled={disabled}
  >
    <Icon />
    Back
  </StyledButton>
);

const StyledButton = styled(Button)`
  margin: 8px;
`;

const Icon = styled(Back)`
  margin-right: 8px;
`;

BackButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default BackButton;
