import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import PlusOne from '@material-ui/icons/PlusOne';
import PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    }
});

const AddRowButton = ({ classes, onClick, disabled }) => (
    <Button className={classes.button}
            variant="raised"
            color="secondary"
            onClick={onClick}
            disabled={disabled}
    >
        <PlusOne className={classes.leftIcon}/>
        Row
    </Button>
);

AddRowButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default withStyles(styles)(AddRowButton);