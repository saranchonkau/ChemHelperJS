import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import trash from '@fortawesome/fontawesome-free-solid/faTrashAlt'
import trash from '@fortawesome/fontawesome-free-regular/faTrashAlt'

const RemoveRowRenderer = ({ api, data }) => (
    <div className='d-flex align-items-center justify-content-center'>
        <button type="button" className='bg-transparent'
                style={{outline: 'none', border: 'none', cursor: 'pointer'}}
                onClick={() => api.updateRowData({ remove: [data] })}
        >
            <FontAwesomeIcon icon={trash} color={'#f50057'} size={'lg'} />
            {/*<span className='i fa fa-trash' style={{fontSize: 20, color: '#f50057'}}/>*/}
        </button>
    </div>
);

export default RemoveRowRenderer;