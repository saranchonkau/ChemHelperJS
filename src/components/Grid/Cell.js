import React from 'react';
import PropTypes from 'prop-types';
import CheckBoxCell from './CheckBoxCell';
import RemoveCell from './RemoveCell';
import OutsideAlerter from 'components/OutsideAlerter';
import { CellTypes } from 'constants/common';
import cx from 'classnames';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      value: props.value,
    };
    this.inputRef = null;
  }

  setInputRef = node => {
    this.inputRef = node;
  };

  handleClick = () => {
    const { type, editable } = this.props;
    if (type === CellTypes.DEFAULT && editable && !this.state.editing) {
      this.setState({ editing: true });
    }
  };

  handleChange = event => {
    const newValue = event.target.value;
    this.setState({ value: this.props.parse(newValue, this.state.value) });
  };

  onBlur = () => {
    const { value, api, field, rowId, normalize } = this.props;
    if (value !== this.state.value) {
      api.updateCell({ rowId, field, newValue: normalize(this.state.value) });
    }
    this.setState({ editing: false });
  };

  onFocus = event => event.target.select();

  onRowRemove = () => this.props.api.removeRow(this.props.rowId);

  onToggleSelection = () => this.props.api.toggleSelection(this.props.rowId);

  renderCellContent = () => {
    const { type, value, format } = this.props;

    switch (type) {
      case CellTypes.DEFAULT:
        return format(value);
      case CellTypes.CHECK_BOX:
        return <CheckBoxCell value={value} onClick={this.onToggleSelection} />;
      case CellTypes.REMOVE:
        return <RemoveCell onClick={this.onRowRemove} />;
      default:
        return null;
    }
  };

  isNaN = () =>
    this.props.type === CellTypes.DEFAULT &&
    Number.isNaN(this.props.value) &&
    !this.state.editing;

  getCellTitle = () =>
    this.props.type === CellTypes.DEFAULT
      ? this.props.format(this.props.value)
      : null;

  render() {
    const { editing, value } = this.state;
    const cellClassName = cx('cell', {
      'error-cell': this.isNaN(),
      editing: editing,
    });
    return (
      <div
        className={cellClassName}
        title={this.getCellTitle()}
        onClick={this.handleClick}
      >
        {editing ? (
          <OutsideAlerter handleClickOutside={this.onBlur}>
            <input
              className="inputCell"
              ref={this.setInputRef}
              autoFocus
              onFocus={this.onFocus}
              value={value}
              onChange={this.handleChange}
            />
          </OutsideAlerter>
        ) : (
          this.renderCellContent()
        )}
      </div>
    );
  }
}

Cell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  headerName: PropTypes.string,
  field: PropTypes.string,
  type: PropTypes.string,
  parse: PropTypes.func,
  format: PropTypes.func,
  api: PropTypes.object,
  rowId: PropTypes.string,
};

const defaultFunc = value => value;

Cell.defaultProps = {
  type: CellTypes.DEFAULT,
  format: defaultFunc,
  parse: defaultFunc,
  normalize: defaultFunc,
};

export default Cell;
