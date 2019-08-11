import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

const numberRegexp = /^[1-9]\d{0,2}$/;

class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      z: '',
      n: '',
      a: '',
    };
  }

  onNumberChange = event => {
    const newValue = event.target.value;
    if (!newValue || numberRegexp.test(newValue)) {
      this.setState({ [event.target.name]: newValue });
    }
  };

  parseNumbers = numbers => {
    const result = {};
    Object.keys(numbers).forEach(key => {
      result[key] = Number.parseInt(numbers[key], 10) || 0;
    });
    return result;
  };

  onFilter = () => {
    const { z, n, a } = this.state;
    this.props.setFilter(this.parseNumbers({ z, n, a }));
  };

  render() {
    const { z, n, a } = this.state;
    return (
      <Container>
        <Title>Filter:</Title>

        <FormControl margin="dense">
          <InputLabel htmlFor={'z'}>Z</InputLabel>
          <Input value={z} name={'z'} onChange={this.onNumberChange} />
        </FormControl>

        <FormControl margin="dense">
          <InputLabel htmlFor={'n'}>N</InputLabel>
          <Input value={n} name={'n'} onChange={this.onNumberChange} />
        </FormControl>

        <FormControl margin="dense">
          <InputLabel htmlFor={'A'}>A</InputLabel>
          <Input value={a} name={'a'} onChange={this.onNumberChange} />
        </FormControl>

        <SubmitButton
          variant="contained"
          color="secondary"
          onClick={this.onFilter}
        >
          Filter
        </SubmitButton>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const Title = styled.header`
  font-size: 30px;
  margin: 2rem auto 1rem auto;
  text-align: center;
`;

const SubmitButton = styled(Button)`
  margin-top: 10px;
`;

export default FilterBar;
