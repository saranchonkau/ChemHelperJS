import React, {Component} from 'react';
import {Button, FormControl, Input, InputLabel, withStyles} from "material-ui";
import NumberFormat from "react-number-format";
import {connect} from 'react-redux';
import {filterNuclides} from "./FilterBarActionCreators";

const NumberInput = ({ inputRef, onChange, ...other }) => {
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            allowNegative={false}
        />
    );
};

const styles = theme => ({});

class FilterBar extends Component {

    constructor(){
        super();
        this.state = {
            z: '',
            n: '',
            symbol: '',
            a: ''
        }
    }

    onNumberChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    render(){
        const {z, n, symbol, a} = this.state;
        const {classes, filter} = this.props;
        return (
            <div style={{width: 300}} className='d-flex flex-column px-3 py-3'>
                <h2>Filter:</h2>
                <FormControl className='mb-2'>
                    <InputLabel htmlFor={'z'}>Z</InputLabel>
                    <Input value={z}
                           id={'z'}
                           onChange={this.onNumberChange('z')}
                           inputComponent={NumberInput}
                    />
                </FormControl>
                <FormControl className='mb-2'>
                    <InputLabel htmlFor={'n'}>N</InputLabel>
                    <Input value={n}
                           id={'n'}
                           onChange={this.onNumberChange('n')}
                           inputComponent={NumberInput}
                    />
                </FormControl>
                <FormControl className='mb-2'>
                    <InputLabel htmlFor={'A'}>A</InputLabel>
                    <Input value={a}
                           id={'a'}
                           onChange={this.onNumberChange('a')}
                           inputComponent={NumberInput}
                    />
                </FormControl>
                <Button variant="raised" color="secondary" onClick={() => filter(this.state)}>Filter</Button>
            </div>
        );
    }
}

export default connect(
    null,
    dispatch => ({
        filter: data => dispatch(filterNuclides(data))
    })
)(withStyles(styles)(FilterBar));