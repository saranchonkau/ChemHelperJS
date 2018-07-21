import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import circle from '@fortawesome/fontawesome-free-regular/faCircle';
import checkCircle from '@fortawesome/fontawesome-free-regular/faCheckCircle';
import Checkbox from '@material-ui/core/Checkbox';
import {withStyles} from '@material-ui/core/styles';

const checkBoxStyles = theme => ({
    root: {
        width: 30,
        height: 30
    }
});

const CheckBoxCell = ({ value, onClick, classes }) => (
    <div className='text-center'>
        <Checkbox checked={value}
                  classes={classes}
                  icon={<FontAwesomeIcon icon={circle} color='#B00020'/>}
                  checkedIcon={<FontAwesomeIcon icon={checkCircle} color='#25bf75'/>}
                  inputProps={{ onClick }}
        />
    </div>
);

CheckBoxCell.propTypes = {
    value: PropTypes.bool,
    onClick: PropTypes.func
};

export default withStyles(checkBoxStyles)(CheckBoxCell);
