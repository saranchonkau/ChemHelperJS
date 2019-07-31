import React from 'react';
import { FormControl, FormHelperText, Input } from '@material-ui/core';
import PropTypes from 'prop-types';
import { intermediateNumberRegexp, dotRegexp } from 'utils/utils';

const errorText = 'Wrong number format';

class MaterialNumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue || '',
      error: '',
    };
  }

  onChange = event => {
    const newValue = event.target.value;
    const correctValue = newValue
      .replace(dotRegexp, '.')
      .replace(/[\u0435\u0443]/, 'e');
    if (intermediateNumberRegexp.test(correctValue)) {
      const value = { value: correctValue, error: '', name: event.target.name };
      this.setState(value);
      this.props.onChange(value);
    }
  };

  onBlur = () => {
    if (this.state.value && !Number.parseFloat(this.state.value)) {
      const error = { error: errorText };
      this.props.onChange(error);
      this.setState(error);
    }
  };

  render() {
    const { name } = this.props;
    const { value, error } = this.state;
    return (
      <FormControl error={Boolean(error)}>
        <Input
          value={value}
          name={name}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    );
  }
}

MaterialNumberInput.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
};

export default MaterialNumberInput;
