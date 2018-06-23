import React, {Component} from 'react';
import {Button, FormControl, Input, InputLabel, withStyles} from "material-ui";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreators} from "./filterBarReducer";

const styles = theme => ({});

const numberRegexp = /^[1-9]\d{0,2}$/;

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
        const newValue = event.target.value;
        if (!newValue || numberRegexp.test(newValue)) {
            this.setState({ [name]: newValue });
        }
    };
	
	componentWillUnmount(){
		this.props.clearFilter();
	}

	parseNumbers = numbers => {
	    const result = {};
	    Object.keys(numbers).forEach(key => {
	        result[key] = Number.parseInt(numbers[key], 10) || 0;
        });
	    return result;
    };

	onFilter = () => {
	    const { z, n, a } = this.state;
	    this.props.filterNuclides(this.parseNumbers({z, n, a}));
    };

    render(){
        const {z, n, symbol, a} = this.state;
        const {classes} = this.props;
        return (
            <div style={{width: 300}} className='d-flex flex-column px-3 py-3'>
                <h2>Filter:</h2>

                <FormControl className='mb-2'>
                    <InputLabel htmlFor={'z'}>Z</InputLabel>
                    <Input value={z} id={'z'} onChange={this.onNumberChange('z')}/>
                </FormControl>

                <FormControl className='mb-2'>
                    <InputLabel htmlFor={'n'}>N</InputLabel>
                    <Input value={n} id={'n'} onChange={this.onNumberChange('n')}/>
                </FormControl>

                <FormControl className='mb-2'>
                    <InputLabel htmlFor={'A'}>A</InputLabel>
                    <Input value={a} id={'a'} onChange={this.onNumberChange('a')}/>
                </FormControl>

                <Button variant="raised" color="secondary" onClick={this.onFilter}>
                    Filter
                </Button>
            </div>
        );
    }
}

export default connect(
    null,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(withStyles(styles)(FilterBar));