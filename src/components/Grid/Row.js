import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';

class Row extends React.Component {

    renderCell = ({ field, ...rest }) => {
        const { api, data, index } = this.props;
        return (
            <Cell
                value={data[field]}
                field={field}
                rowIndex={index}
                api={api}
                key={`${index}_${field}`}
                {...rest}
            />
        );
    };

    render(){
        const { columnDefs, style } = this.props;
        return (
            <div className='grid-row' style={style}>
                {columnDefs.map(this.renderCell)}
            </div>
        );
    }
}

Row.propTypes = {
    data: PropTypes.object,
    columnDefs: PropTypes.arrayOf(PropTypes.shape({
        headerName: PropTypes.string,
        field: PropTypes.string,
        type: PropTypes.string,
        editable: PropTypes.bool,
        parse: PropTypes.func,
        format: PropTypes.func,
        normalize: PropTypes.func
    })).isRequired,
    index: PropTypes.number,
    api: PropTypes.object,
    style: PropTypes.object
};

export default Row;