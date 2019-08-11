import React from 'react';
import PropTypes from 'prop-types';
import isElectron from 'is-electron';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Download from '@material-ui/icons/GetApp';

import { sendMessage } from 'utils/ipc';

const savePattern = type => {
  if (isElectron()) {
    sendMessage('saveExcelPattern', type);
  }
};

const SavePatternButton = ({ patternType, disabled }) => (
  <StyledButton
    variant="contained"
    color="primary"
    onClick={() => savePattern(patternType)}
    disabled={disabled}
  >
    Save excel pattern
    <Icon />
  </StyledButton>
);

const StyledButton = styled(Button)`
  margin: 8px;
`;

const Icon = styled(Download)`
  margin-left: 8px;
`;

SavePatternButton.propTypes = {
  disabled: PropTypes.bool,
  patternType: PropTypes.string.isRequired,
};

export default SavePatternButton;
