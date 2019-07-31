import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FileCopy from '@material-ui/icons/FileCopy';
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

const copyDataToClipboard = text => {
  if (isElectron()) {
    window.ipcRenderer.send('copyToClipboard', text);
  }
};

const CopyButton = ({ classes, text, disabled }) => (
  <Button
    className={classes.button}
    variant="raised"
    color="primary"
    onClick={() => copyDataToClipboard(text)}
    disabled={disabled}
  >
    Copy data
    <FileCopy className={classes.rightIcon} />
  </Button>
);

CopyButton.propTypes = {
  disabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export default withStyles(styles)(CopyButton);
