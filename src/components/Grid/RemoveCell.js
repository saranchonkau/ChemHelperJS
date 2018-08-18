import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import trash from '@fortawesome/fontawesome-free-regular/faTrashAlt';

const RemoveCell = ({ onClick }) => (
    <div className='text-center'>
        <button
            type="button"
            className='bg-transparent'
            style={{outline: 'none', border: 'none', cursor: 'pointer'}}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={trash} color={'#f50057'} size={'lg'} />
        </button>
    </div>
);

RemoveCell.propTypes = {
    onClick: PropTypes.func
};

export default RemoveCell;