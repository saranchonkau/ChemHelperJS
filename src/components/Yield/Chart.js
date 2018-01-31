import React, {Component} from 'react';
import {styles} from "./Yield";
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Forward from 'material-ui-icons/ArrowForward';
import Back from 'material-ui-icons/ArrowBack';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';

class Chart extends Component{

    convertInitialData = () => {
        return this.props.data.map( data => ({ x: data.concentration, y: data.dencity }) );
    };

    render() {
        let initialData = this.convertInitialData();
        let diff = (Math.max.apply(Math, initialData.map(point => point.x)) -
            Math.min.apply(Math, initialData.map(point => point.x))) * 0.05;

        let data = {
            datasets: [
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
                    pointRadius: 3,
                    pointHitRadius: 10,
                    data: initialData
                }
            ]
        };

        const options = {
            legend: {
                display: false
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
                        min: Math.min.apply(Math, initialData.map(point => point.x)) - diff > 0 ?
                             Math.min.apply(Math, initialData.map(point => point.x)) - diff : 0,
                        max: Math.max.apply(Math, initialData.map(point => point.x)) + diff
                    }
                }],
            }
        };
        let { classes } = this.props;
        return (
            <div>
                <h3 className="my-3 text-center">Line Example</h3>
                <div  className="d-flex flex-row justify-content-center">
                    <div style={{width: 700, height: 600}}>
                        <Line data={data} options={options}/>
                        <div className='d-flex flex-row justify-content-between'>
                            <Button className={classes.button} raised color="secondary" onClick={this.props.previousPage}>
                                <Back className={classes.leftIcon} />
                                Back
                            </Button>
                            <Button className={classes.button} raised color="primary" onClick={this.props.nextPage}>
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
