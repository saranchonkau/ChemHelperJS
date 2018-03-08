import React from 'react';
import PropTypes from 'prop-types';

const CloseButton = ({buttonStyle, buttonClassName, iconStyle, iconClassName, onClick}) => (
    <button type="button"
            style={buttonStyle ? buttonStyle : {}}
            className={buttonClassName ? `${buttonClassName} close` : 'close'}
            aria-label="Close"
            onClick={onClick}>
        <span className={iconClassName} aria-hidden="true" style={{...iconStyle, fontSize: 36}}>&times;</span>
    </button>
);

CloseButton.propTypes = {
    buttonStyle: PropTypes.object,
    buttonClassName: PropTypes.string,
    iconStyle: PropTypes.object,
    iconClassName: PropTypes.string,
    onClick: PropTypes.func
};

export default CloseButton;