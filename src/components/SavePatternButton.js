import React from 'react';
import PropTypes from 'prop-types';
import isElectron from 'is-electron';
import Download from '@material-ui/icons/GetApp';

import { sendMessage } from 'utils/ipc';
import { ExcelPatternTypes } from 'constants/common';

import MaterialButton from './MaterialButton';

const savePattern = type => {
  if (isElectron()) {
    sendMessage('saveExcelPattern', type);
  }
};

const SavePatternButton = ({ patternType, ...props }) => (
  <MaterialButton
    color="primary"
    onClick={() => savePattern(patternType)}
    rightIcon={Download}
    {...props}
  >
    Save excel pattern
  </MaterialButton>
);

SavePatternButton.propTypes = {
  patternType: PropTypes.oneOf(Object.values(ExcelPatternTypes)),
};

export default SavePatternButton;
