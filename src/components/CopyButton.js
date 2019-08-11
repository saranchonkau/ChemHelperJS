import React from 'react';
import PropTypes from 'prop-types';
import isElectron from 'is-electron';

import FileCopy from '@material-ui/icons/FileCopy';

import { sendMessage } from 'utils/ipc';

import MaterialButton from './MaterialButton';

const copyDataToClipboard = text => {
  if (isElectron()) {
    sendMessage('copyToClipboard', text);
  }
};

const CopyButton = ({ text, ...props }) => (
  <MaterialButton
    {...props}
    rightIcon={FileCopy}
    color="primary"
    onClick={() => copyDataToClipboard(text)}
  >
    Copy data
  </MaterialButton>
);

CopyButton.propTypes = {
  text: PropTypes.string,
};

export default CopyButton;
