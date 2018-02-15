import React, {Component} from 'react';
import {styles} from "../Yield/Yield";
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Back from 'material-ui-icons/ArrowBack';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import {Equation, getTrendResult, ReduxForms, Result, RSquared, Units} from "../../utils/utils";

class FinalChart extends Component {

    constructor(props){
        super(props);
        let {finalData} = props;
        let data = finalData.map(point => ({...point, time: point.time * 60}));

        this.state = {
            data: data
        };
    }

    calculateDoseRate = slope => {
        let coefficient = 6.022140e6 * 1.602176;
        let yieldPerJoule = slope / (this.props.solutionDensity * this.props.radYield);
        return this.props.unit === Units.moleculesPerHundredVolt ?
            yieldPerJoule * coefficient : yieldPerJoule;
    };

    getSelectedData = () => {
        return this.state.data.filter(point => point.isSelected)
            .map( data => ({ x: data.time, y: data.concentration }) );
    };

    getUnselectedData = () => {
        return this.state.data.filter(point => !point.isSelected)
            .map( data => ({ x: data.time, y: data.concentration }) );
    };

    getTrendData = () => {
        let data = this.getSelectedData();
        let trendFunc = getTrendResult(data).predictY;
        return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
    };

    render() {
        let xArray = this.state.data.map(point => point.time);
        let yArray = this.state.data.map(point => point.concentration);
        let diff = (Math.max.apply(Math, xArray) -
            Math.min.apply(Math, xArray)) * 0.05;
        console.log('Selected: ', this.getSelectedData());
        console.log('UnSelected: ', this.getUnselectedData());
        console.log('Trend: ', this.getTrendData());
        let data = {
            datasets: [
                {
                    showLine: false,
                    fill: false,
                    pointBorderColor: 'green',
                    pointBackgroundColor: 'green',
                    pointBorderWidth: 1,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'green',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 10,
                    data: this.getSelectedData()
                },
                {
                    showLine: false,
                    pointBorderColor: 'red',
                    pointBackgroundColor: 'red',
                    pointBorderWidth: 1,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'red',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 10,
                    data: this.getUnselectedData()
                },
                {
                    fill: false,
                    lineTension: 0,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'green',
                    pointBackgroundColor: 'green',
                    pointBorderWidth: 1,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 0,
                    pointHitRadius: 10,
                    data: this.getTrendData()
                }
            ]
        };
        const options = {
            legend: {
                display: false
            },
            hover: {
                mode: 'point'
            },
            tooltips: {
                displayColors: false,
                bodyFontSize: 16,
                callbacks: {
                    // use label callback to return the desired label
                    label: (tooltipItem, data) => [
                        `Concentration: ${tooltipItem.yLabel} mol/l`,
                        `Time: ${tooltipItem.xLabel} sec`,
                    ],
                    // remove title
                    title: (tooltipItem, data) => {
                        return;
                    }
                }
            },
            scales: {
                yAxes: [{
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: 'Concentration, M',
                        fontSize: 16,
                        fontStyle: 'bold'
                    }
                }],
                xAxes: [{
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: 'Time, sec',
                        fontSize: 16,
                        fontStyle: 'bold'
                    },
                    offset: true,
                    ticks: {
                        min: Math.min.apply(Math, xArray) - diff > 0 ?
                            Math.min.apply(Math, xArray) - diff : 0,
                        max: Math.max.apply(Math, xArray) + diff
                    }
                }],
            }
        };
        let { classes } = this.props;
        let result = getTrendResult(this.getSelectedData());
        return (
            <div>
                <h3 className="my-3 text-center">Dose rate calculation</h3>
                <h5 className="text-center">Final chart</h5>
                <div  className="d-flex flex-row justify-content-center">
                    <div style={{width: 700, height: 600}}>
                        <Line data={data} options={options}/>
                        <div style={{marginLeft: '5rem'}}>
                            <Equation slope={result.slope} intercept={result.intercept}/>
                            <br/>
                            <RSquared rSquared={result.rSquared}/>
                            <br/>
                            <Result name={'DoseRate'}
                                    value={this.calculateDoseRate(result.slope)}
                                    error={this.calculateDoseRate(result.slopeError)}
                                    unit={this.props.unit}
                            />
                        </div>
                        <div className='d-flex flex-row justify-content-between'>
                            <Button className={classes.button} variant="raised" color="secondary" onClick={this.props.previousPage}>
                                <Back className={classes.leftIcon} />
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

FinalChart = connect(
    state => ({
        finalData: getFormValues(ReduxForms.DoseRate)(state).finalData,
        radYield: getFormValues(ReduxForms.DoseRate)(state).radYield,
        solutionDensity: getFormValues(ReduxForms.DoseRate)(state).solutionDensity,
        unit: getFormValues(ReduxForms.DoseRate)(state).unit,
    })
)(FinalChart);

export default reduxForm({
    form: ReduxForms.DoseRate, // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withStyles(styles)(FinalChart));