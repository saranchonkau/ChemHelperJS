import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import sortIcon from '@fortawesome/fontawesome-free-solid/faSort';
import sortUpIcon from '@fortawesome/fontawesome-free-solid/faSortUp';
import sortDownIcon from '@fortawesome/fontawesome-free-solid/faSortDown';
import get from 'lodash/get';
import { SortTypes } from 'constants/common';

class SortableHeaderCell extends React.Component {
  getSortIcon = () => {
    switch (
      get(this.props, `sortModel[${this.props.sortOrder}].sort`, SortTypes.NONE)
    ) {
      case SortTypes.ASC:
        return sortUpIcon;
      case SortTypes.DESC:
        return sortDownIcon;

      default:
        return sortIcon;
    }
  };

  render() {
    const { headerName, onSort, sortOrder, sortModel } = this.props;
    return (
      <div className="cell">
        {headerName}
        <Button type="button" onClick={onSort}>
          {sortModel.length > 1 && sortOrder !== -1 && (
            <span style={{ color: 'white' }}>{sortOrder + 1}</span>
          )}
          <FontAwesomeIcon
            icon={this.getSortIcon()}
            style={{ color: 'white' }}
          />
        </Button>
      </div>
    );
  }
}

const Button = styled.button`
  padding: 0;
  outline: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  float: right;
`;

SortableHeaderCell.propTypes = {
  headerName: PropTypes.string,
  field: PropTypes.string,
  sortModel: PropTypes.arrayOf(
    PropTypes.shape({
      columnIndex: PropTypes.number,
      sort: PropTypes.string,
    }),
  ),
  sortOrder: PropTypes.number,
  onSort: PropTypes.func,
};

export default SortableHeaderCell;
