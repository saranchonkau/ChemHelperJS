import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Forward from 'material-ui-icons/ArrowForward';
import PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

const NextButton = ({ classes, onClick, disabled }) => (
    <Button className={classes.button}
            variant="raised"
            color="primary"
            onClick={onClick}
            disabled={disabled}
    >
        Next
        <Forward className={classes.rightIcon}/>
    </Button>
);

NextButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default withStyles(styles)(NextButton);