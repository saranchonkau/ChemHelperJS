import React from 'react';
import { FormControl, FormHelperText, Input } from '@material-ui/core';
import PropTypes from 'prop-types';
import { intermediateNumberRegexp, dotRegexp } from 'utils/common';

const errorText = 'Wrong number format';

class MaterialNumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue || '',
      error: '',
    };
  }

  getError = value =>
    Number.isFinite(Number.parseFloat(value)) ? '' : errorText;

  onChange = event => {
    const newValue = event.target.value;
    const correctValue = newValue
      .replace(dotRegexp, '.')
      .replace(/[\u0435\u0443]/, 'e');
    if (intermediateNumberRegexp.test(correctValue)) {
      const result = {
        value: correctValue,
        error: this.getError(newValue),
        name: event.target.name,
      };
      this.setState(result);
      this.props.onChange(result);
    }
  };

  render() {
    const { name } = this.props;
    const { value, error } = this.state;
    return (
      <FormControl error={Boolean(error)}>
        <Input value={value} name={name} onChange={this.onChange} />
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    );
  }
}

MaterialNumberInput.propTypes = {
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

export default MaterialNumberInput;
