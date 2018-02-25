import React, {Component} from 'react';
import {styles} from "./CalibrationTable";
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
        let {doseRate, finalData} = props;
        let data = finalData.map(point => {
            point.dose = doseRate * 60 * point.time;
            return point;
        });

        this.state = {
            data: data
        };
    }

    calculateYield = slope => {
        let coefficient = 6.022140e6 * 1.602176;
        let yieldPerJoule = slope / this.props.solutionDensity;
        return this.props.unit === Units.moleculesPerHundredVolt ?
            yieldPerJoule * coefficient : yieldPerJoule;
    };

    getSelectedData = () => {
        return this.state.data.filter(point => point.isSelected)
            .map( data => ({ x: data.dose, y: data.concentration }) );
    };

    getUnselectedData = () => {
        return this.state.data.filter(point => !point.isSelected)
            .map( data => ({ x: data.dose, y: data.concentration }) );
    };

    getTrendData = () => {
        let data = this.getSelectedData();
        let trendFunc = getTrendResult(data).predictY;
        return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
    };

    render() {
        let xArray = this.state.data.map(point => point.dose);
        let yArray = this.state.data.map(point => point.concentration);
        let diff = (Math.max.apply(Math, xArray) -
            Math.min.apply(Math, xArray)) * 0.05;
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
                        `Absorbed dose: ${tooltipItem.xLabel} Gray`,
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
                        fontSize: 20,
                        fontStyle: 'bold',
                        fontFamily: 'KaTeX_Math',
                        fontColor: '#212529'
                    },
                    ticks: {
                        fontColor: '#212529',
                        fontFamily: 'KaTeX_Math',
                        fontSize: 17,
                    }
                }],
                xAxes: [{
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: 'Absorbed dose, Gray',
                        fontSize: 20,
                        fontStyle: 'bold',
                        fontFamily: 'KaTeX_Math',
                        fontColor: '#212529'
                    },
                    offset: true,
                    ticks: {
                        min: Math.min.apply(Math, xArray) - diff > 0 ?
                            Math.min.apply(Math, xArray) - diff : 0,
                        max: Math.max.apply(Math, xArray) + diff,
                        fontColor: '#212529',
                        fontFamily: 'KaTeX_Math',
                        fontSize: 17
                    }
                }],
            }
        };
        let { classes } = this.props;
        let result = getTrendResult(this.getSelectedData());
        return (
            <div>
                <h3 className="my-3 text-center">Radiation chemistry yield from chart</h3>
                <h5 className="text-center">Final chart</h5>
                <div  className="d-flex flex-row justify-content-center">
                    <div style={{width: 700, height: 600}}>
                        <Line data={data} options={options}/>
                        <div style={{marginLeft: '5rem'}}>
                            <Equation slope={result.slope} intercept={result.intercept}/>
                            <br/>
                            <RSquared rSquared={result.rSquared}/>
                            <br/>
                            <Result name={'Yield'}
                                    value={this.calculateYield(result.slope)}
                                    error={this.calculateYield(result.slopeError)}
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
        finalData: getFormValues(ReduxForms.Yield)(state).finalData,
        doseRate: getFormValues(ReduxForms.Yield)(state).doseRate,
        solutionDensity: getFormValues(ReduxForms.Yield)(state).solutionDensity,
        unit: getFormValues(ReduxForms.Yield)(state).unit,
    })
)(FinalChart);

export default reduxForm({
    form: ReduxForms.Yield, // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withStyles(styles)(FinalChart));