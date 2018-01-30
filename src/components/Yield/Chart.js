import React, {Component} from 'react';
import {styles} from "./Yield";
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import ArrowForward from 'material-ui-icons/ArrowForward';
import ArrowBack from 'material-ui-icons/ArrowBack';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';

class Chart extends Component{

    convertInitialData = () => {
        return this.props.data.map( data => ({ x: data.concentration, y: data.dencity }) );
    };

    render() {
        let data = {
            datasets: [
                {
                    label: 'My First dataset',
                    fill: false,
                    lineTension: 0,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.convertInitialData()
                }
            ]
        };
        return (
            <div>
                <h2>Line Example</h2>
                <Line data={data} />
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
