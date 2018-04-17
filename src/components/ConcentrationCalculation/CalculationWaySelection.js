import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import {ConcentrationCalculationWays} from "../../utils/utils";
import NextButton from '../Others/NextButton';
import {getFormValues, reduxForm} from "redux-form";
import {connect} from "react-redux";

const styles = theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
    label: {
        fontSize: '1rem'
    },
    checked: {
        color: '#25bf75'
    },
    formLabelRoot: {
        color: 'rgb(33, 37, 41)',
        fontSize: '1.2rem',
        fontWeight: 500
    },
    formLabelFocused: {
        color: 'rgb(33, 37, 41)',
        fontSize: '1.2rem',
        fontWeight: 500
    }
});

const CalculationWaySelectionWrapper = ({form, ...rest}) => {
    class CalculationWaySelection extends Component {

        constructor(props) {
            super(props);

            this.state = {
                calculationWay: ConcentrationCalculationWays.OWN_WAY
            };
        }

        handleChange = (event, value) => this.setState({calculationWay: value});

        nextPage = () => {
            this.props.change('calculationWay', this.state.calculationWay);
            this.props.goToPage(Number.parseInt(this.state.calculationWay, 10));
        };

        render() {
            const {classes, title} = this.props;
            const {OWN_WAY, MOLAR_ATTENUATION_COEFFICIENT_WAY, CALIBRATION_TABLE_WAY} = ConcentrationCalculationWays;
            return (
                <React.Fragment>
                    <h3 className="my-3 text-center">{title}</h3>
                    <div className='d-flex justify-content-center'>
                        <div style={{width: 540}}>
                            <div className={classes.root}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormLabel component="legend" classes={{
                                        root: classes.formLabelRoot,
                                        focused: classes.formLabelFocused
                                    }}>Choose way of concentration calculation:</FormLabel>
                                    <RadioGroup
                                        name="calculationWaySelection"
                                        className={classes.group}
                                        value={this.state.calculationWay}
                                        onChange={this.handleChange}
                                    >
                                        <FormControlLabel classes={{label: classes.label}}
                                                          value={OWN_WAY}
                                                          control={<Radio classes={{checked: classes.checked}}/>}
                                                          label="Enter own values"/>
                                        <FormControlLabel classes={{label: classes.label}}
                                                          value={MOLAR_ATTENUATION_COEFFICIENT_WAY}
                                                          control={<Radio classes={{checked: classes.checked}}/>}
                                                          label="Calculate with molar extinction coefficient"/>
                                        <FormControlLabel classes={{label: classes.label}}
                                                          value={CALIBRATION_TABLE_WAY}
                                                          control={<Radio classes={{checked: classes.checked}}/>}
                                                          label="Calculate with calibration table"/>
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

    CalculationWaySelection = connect(
        state => ({
            data: getFormValues(form)(state).initialData
        })
    )(CalculationWaySelection);

    CalculationWaySelection = reduxForm({
        form: form,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    })(withStyles(styles)(CalculationWaySelection));

    return <CalculationWaySelection {...rest}/>
};

export default CalculationWaySelectionWrapper;