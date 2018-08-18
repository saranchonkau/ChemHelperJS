import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import sortIcon from '@fortawesome/fontawesome-free-solid/faSort';
import sortUpIcon from '@fortawesome/fontawesome-free-solid/faSortUp';
import sortDownIcon from '@fortawesome/fontawesome-free-solid/faSortDown';
import get from 'lodash/get';
import {SortTypes} from "../../constants/index";

const styles = theme => ({
    button: {
        padding: 0,
        outline: 'none',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        float: 'right'
    }
});

class SortableHeaderCell extends React.Component {

    getSortIcon = () => {
        switch(get(this.props, `sortModel[${this.props.sortOrder}].sort`, SortTypes.NONE)){
            case SortTypes.ASC: return sortUpIcon;
            case SortTypes.DESC: return sortDownIcon;

            default: return sortIcon;
        }
    };

    render(){
        const { headerName, onSort, classes, sortOrder, sortModel } = this.props;
        return (
            <div className='cell'>
                {headerName}
                <button type='button' className={classes.button} onClick={onSort}>
                    {
                        sortModel.length > 1 && sortOrder !== -1 &&
                        <span style={{color: 'white'}}>{sortOrder + 1}</span>
                    }
                    <FontAwesomeIcon icon={this.getSortIcon()} style={{color: 'white'}}/>
                </button>
            </div>
        );
    }
}

SortableHeaderCell.propTypes = {
    headerName: PropTypes.string,
    field: PropTypes.string,
    sortModel: PropTypes.arrayOf(PropTypes.shape({
        columnIndex: PropTypes.number,
        sort: PropTypes.string
    })),
    sortOrder: PropTypes.number,
    onSort: PropTypes.func
};

export default withStyles(styles)(SortableHeaderCell);