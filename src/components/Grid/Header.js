import React from 'react';
import PropTypes from 'prop-types';
import SortableHeaderCell from './SortableHeaderCell';

class Header extends React.Component {

    getColumnSortModel = columnIndex => this.props.sortModel.find(model => model.columnIndex === columnIndex);

    renderColumnName = (columnDefinition, index) => {
        return columnDefinition.sortable
            ? <SortableHeaderCell {...columnDefinition}
                                  key={index}
                                  sortModel={this.getColumnSortModel(index)}
                                  onSort={() => this.props.api.sortColumn(index)}/>
            : (<div className='cell' key={index}>{columnDefinition.headerName}</div>);
    };

    render(){
        const { columnDefs, style } = this.props;
        return (
            <div className='header' style={style}>
                {columnDefs.map(this.renderColumnName)}
            </div>
        );
    }
}

Header.propTypes = {
    columnDefs: PropTypes.arrayOf(PropTypes.shape({
        headerName: PropTypes.string,
        field: PropTypes.string,
        type: PropTypes.string,
        editable: PropTypes.bool,
        parse: PropTypes.func,
        format: PropTypes.func,
        normalize: PropTypes.func
    })).isRequired,
    style: PropTypes.object,
    sortModel: PropTypes.arrayOf(PropTypes.shape({
        columnIndex: PropTypes.number,
        sort: PropTypes.string
    })),
    api: PropTypes.object
};

export default Header;