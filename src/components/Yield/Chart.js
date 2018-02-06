import React, {Component} from 'react';
import {styles} from "./Yield";
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Forward from 'material-ui-icons/ArrowForward';
import Back from 'material-ui-icons/ArrowBack';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import lsq from 'least-squares';

class Chart extends Component {

    convertSelectedData = () => {
        return this.props.data.filter(point => point.isSelected)
            .map( data => ({ x: data.concentration, y: data.dencity }) );
    };

    getUnselectedData = () => {
        return this.props.data.filter(point => !point.isSelected)
            .map( data => ({ x: data.concentration, y: data.dencity }) );
    };

    getTrendData = () => {
        let data = this.convertSelectedData();
        let trendFunc = this.getTrendFunc();
        return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
    };

    getTrendFunc = () => {
        let data = this.convertSelectedData();
        let xArray = data.map(point => point.x);
        let yArray = data.map(point => point.y);
        let result = {};
        return lsq(xArray, yArray, true, result);
    };

    nextPage = () => {
        let data = this.convertSelectedData();
        let xArray = data.map(point => point.x);
        let yArray = data.map(point => point.y);
        let result = {};
        let func = lsq(yArray, xArray, true, result);
        this.props.change('trendFunc', func);
        this.props.nextPage();
    };

    render() {
        let initialData = this.convertSelectedData();
        let xArray = initialData.map(point => point.x);
        let yArray = initialData.map(point => point.y);
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
                    data: this.convertSelectedData()
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
                },
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
                        `Optical dencity: ${tooltipItem.yLabel}`,
                        `Concentration: ${tooltipItem.xLabel} mol/l`,
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
                        labelString: 'Optical dencity, D',
                        fontSize: 16,
                        fontStyle: 'bold'
                    }
                }],
                xAxes: [{
                    type: 'linear',
                    scaleLabel: {
                        display: true,
                        labelString: 'Concentration, M',
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
        let result = {};
        let trendFunc = lsq(xArray, yArray, true, result);
        console.log('RET: ', result);
        return (
            <div>
                <h3 className="my-3 text-center">Line Example</h3>
                <div  className="d-flex flex-row justify-content-center">
                    <div style={{width: 700, height: 600}}>
                        <Line data={data} options={options}/>
                        <span>y = {result.m}*x + ({result.b})</span>
                        <div className='d-flex flex-row justify-content-between'>
                            <Button className={classes.button} raised color="secondary" onClick={this.props.previousPage}>
                                <Back className={classes.leftIcon} />
                                Back
                            </Button>
                            <Button className={classes.button} raised color="primary" onClick={this.nextPage}>
                                Next
                                <Forward className={classes.rightIcon} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Chart = connect(
    state => ({
        data: getFormValues('Wizard')(state).initialData
    })
)(Chart);

export default reduxForm({
    form: 'Wizard', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withStyles(styles)(Chart));
