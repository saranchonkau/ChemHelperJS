import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FileDownload from '@material-ui/icons/FontDownload';
import PropTypes from 'prop-types';
import isElectron from 'is-electron';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

const savePattern = type => {
  if (isElectron()) {
    window.ipcRenderer.send('saveExcelPattern', type);
  }
};

const SavePatternButton = ({ classes, patternType, disabled }) => (
  <Button
    className={classes.button}
    variant="raised"
    color="primary"
    onClick={() => savePattern(patternType)}
    disabled={disabled}
  >
    Save excel pattern
    <FileDownload className={classes.rightIcon} />
  </Button>
);

SavePatternButton.propTypes = {
  disabled: PropTypes.bool,
  patternType: PropTypes.string.isRequired,
};

export default withStyles(styles)(SavePatternButton);
