import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

function MaterialButton({
  children,
  className,
  rightIcon: RightIcon,
  leftIcon: LeftIcon,
  variant = 'contained',
  color = 'secondary',
  ...rest
}) {
  const classes = useStyles();
  return (
    <Button
      className={cx(classes.button, className)}
      variant={variant}
      color={color}
      {...rest}
    >
      {LeftIcon ? <LeftIcon className={classes.leftIcon} /> : null}
      {children}
      {RightIcon ? <RightIcon className={classes.rightIcon} /> : null}
    </Button>
  );
}

MaterialButton.propTypes = {
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  color: PropTypes.oneOf(['inherit', 'primary', 'secondary', 'default']),
  rightIcon: PropTypes.object,
  leftIcon: PropTypes.object,
  className: PropTypes.func,
};

export default MaterialButton;
