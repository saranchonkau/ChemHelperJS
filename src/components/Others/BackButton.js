import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Back from '@material-ui/icons/ArrowBack';
import PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    }
});

const BackButton = ({ classes, onClick, disabled }) => (
    <Button className={classes.button}
            variant="raised"
            color="secondary"
            onClick={onClick}
            disabled={disabled}
    >
        <Back className={classes.leftIcon} />
        Back
    </Button>
);

BackButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default withStyles(styles)(BackButton);