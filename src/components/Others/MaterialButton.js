import React from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    }
});

const MaterialButton = ({ text, classes, onClick, disabled }) => (
    <Button className={classes.button}
            variant="raised"
            color="secondary"
            onClick={onClick}
            disabled={disabled}
    >
        {text}
    </Button>
);

MaterialButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    text: PropTypes.string
};

export default withStyles(styles)(MaterialButton);