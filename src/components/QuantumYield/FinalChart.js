import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import {
    Equation, getTrendResult, ReduxForms, Result, RSquared, suggestMaxValue, suggestMinValue
} from "../../utils/utils";
import {chartOptions, datasets} from "../../utils/charts";
import BackButton from '../Others/BackButton';

const styles = theme => ({});

class FinalChart extends Component {

    constructor(props){
        super(props);
        this.state = {
            dataForChart: props.finalData.map(data => ({
                x: data.time * 60 * props.lightIntensity / 1e18,
                y: data.concentration,
                isSelected: data.isSelected
            })),
            dataForCalculation: props.finalData.filter(point => point.isSelected)
                .map(point => ({
                    x: point.time * 60,
                    y: point.concentration
                }))
        };
    }

    calculateQuantumYield = slope => {
        const {volume, lightIntensity} = this.props;
        return (6.022140e23 * volume * slope) / (1000 * lightIntensity);
    };

    getSelectedData = () => this.state.dataForChart.filter(point => point.isSelected);

    getUnselectedData = () => this.state.dataForChart.filter(point => !point.isSelected);

    getTrendData = () => {
        let data = this.getSelectedData();
        console.log(this.state.dataForChart);
        console.log(getTrendResult(this.state.dataForChart));
        let trendFunc = getTrendResult(data).predictY;
        return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
    };

    getChartProps = () => {
        const xArray = this.state.dataForChart.map(point => point.x);
        console.log('ARRAY: ', xArray);
        console.log('MIN: ', suggestMinValue(xArray));
        return {
            data: {
                datasets: [
                    datasets.selectedData({data: this.getSelectedData()}),
                    datasets.unselectedData({data: this.getUnselectedData()}),
                    datasets.trendData({data: this.getTrendData()})
                ]
            },
            options: chartOptions({
                tooltipLabelCallback: (tooltipItem, data) => [
                    `Concentration: ${tooltipItem.yLabel} mol/l`,
                    `Light intensity: ${tooltipItem.xLabel} E-18 photon/s`,
                ],
                xLabel: 'Light intensity I * E-18, photon/s',
                yLabel: 'Concentration, M',
                xTicksMin: suggestMinValue(xArray),
                xTicksMax: suggestMaxValue(xArray)
            })
        };
    };

    render() {
        const {dataForCalculation} = this.state;
        const { classes, previousPage } = this.props;
        const resultForChart = getTrendResult(this.getSelectedData());
        const result = getTrendResult(dataForCalculation);
        console.log('Result: ', result);
        return (
            <div>
                <h3 className="my-3 text-center">Quantum yield calculation</h3>
                <h5 className="text-center">Final chart</h5>
                <div  className="d-flex flex-row justify-content-center">
                    <div style={{width: 700, height: 600}}>
                        <Line {...this.getChartProps()}/>
                        <div style={{marginLeft: '5rem'}}>
                            <Equation slope={resultForChart.slope} intercept={resultForChart.intercept}/>
                            <br/>
                            <RSquared rSquared={resultForChart.rSquared}/>
                            <br/>
                            <span style={{fontFamily: 'KaTeX_Math'}}>Confidence interval: 95%</span>
                            <br/>
                            <Result name={'Quantum Yield'}
                                    value={this.calculateQuantumYield(result.slope)}
                                    error={this.calculateQuantumYield(result.slopeConfidenceInterval)}
                            />
                        </div>
                        <div className='d-flex flex-row justify-content-between'>
                            <BackButton onClick={previousPage}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

FinalChart = connect(
    state => ({
        finalData: getFormValues(ReduxForms.QuantumYield)(state).finalData,
        volume: getFormValues(ReduxForms.QuantumYield)(state).volume,
        lightIntensity: getFormValues(ReduxForms.QuantumYield)(state).lightIntensity,
    })
)(FinalChart);

export default reduxForm({
    form: ReduxForms.QuantumYield, // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withStyles(styles)(FinalChart));