import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import {ConcentrationCalculationWays} from "../../utils/utils";
import NextButton from '../Others/NextButton';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    }
});

class CalculationWaySelection extends Component {

    constructor(props){
        super(props);

        this.state = {
            calculationWay: ConcentrationCalculationWays.OWN_WAY
        };
    }

    handleChange = (event, value) => this.setState({ calculationWay: value });

    nextPage = () => this.props.goToPage(Number.parseInt(this.state.calculationWay, 10));

    render(){
        const {classes, title} = this.props;
        const { OWN_WAY, MOLAR_ATTENUATION_COEFFICIENT_WAY, CALIBRATION_TABLE_WAY } = ConcentrationCalculationWays;
        return (
            <React.Fragment>
                <h3 className="my-3 text-center">{title}</h3>
                <div className='d-flex justify-content-center'>
                    <div style={{width: 540}}>
                        <div className={classes.root}>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormLabel component="legend">Choose way of concentration calculation:</FormLabel>
                                <RadioGroup
                                    name="calculationWaySelection"
                                    className={classes.group}
                                    value={this.state.calculationWay}
                                    onChange={this.handleChange}
                                >
                                    <FormControlLabel value={OWN_WAY} control={<Radio />} label="Enter own values" />
                                    <FormControlLabel value={MOLAR_ATTENUATION_COEFFICIENT_WAY} control={<Radio />} label="Calculate with molar attenuation coefficient" />
                                    <FormControlLabel value={CALIBRATION_TABLE_WAY} control={<Radio />} label="Calculate with calibration table" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className='d-flex flex-row justify-content-end'>
                            <NextButton onClick={this.nextPage}/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(CalculationWaySelection);