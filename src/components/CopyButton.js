import React from 'react';
import PropTypes from 'prop-types';
import isElectron from 'is-electron';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import FileCopy from '@material-ui/icons/FileCopy';

import { sendMessage } from 'utils/ipc';

const copyDataToClipboard = text => {
  if (isElectron()) {
    sendMessage('copyToClipboard', text);
  }
};

const CopyButton = ({ text, disabled }) => (
  <StyledButton
    variant="contained"
    color="primary"
    onClick={() => copyDataToClipboard(text)}
    disabled={disabled}
  >
    Copy data
    <Icon />
  </StyledButton>
);

const StyledButton = styled(Button)`
  margin: 8px;
`;

const Icon = styled(FileCopy)`
  margin-left: 8px;
`;

CopyButton.propTypes = {
  disabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export default CopyButton;
