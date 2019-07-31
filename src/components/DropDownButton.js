import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

const DropDownButton = ({ classes, onClick, disabled, ...rest }) => (
    <Button className={classes.button}
            variant="raised"
            color="primary"
            onClick={onClick}
            disabled={disabled}
            {...rest}
    >
        Export to Excel
        <ArrowDropDown/>
    </Button>
);

DropDownButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default withStyles(styles)(DropDownButton);