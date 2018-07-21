import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import {
    Equation, ExcelPatternTypes, getTrendResult, ReduxForms, Result, RSquared, suggestMaxValue, suggestMinValue
} from "../../utils/utils";
import {chartOptions, datasets} from "../../utils/charts";
import BackButton from '../Others/BackButton';
import SavePatternButton from "../Others/SavePatternButton";
import CopyButton from "../Others/CopyButton";
import {createQuantumYieldTSVFile} from "../../utils/excel/quantumYield";

const styles = theme => ({});

class FinalChart extends Component {

    constructor(props){
        super(props);
        this.data = props.finalData.map(point => ({ ...point, time: point.time * 60 }));
        this.result = getTrendResult(this.getSelectedData());
        this.quantumYield = this.calculateQuantumYield(this.result.slope);
        this.confidenceInterval = this.result.slopeConfidenceInterval && this.calculateQuantumYield(this.result.slopeConfidenceInterval);
    }

    calculateQuantumYield = slope => {
        const {volume, lightIntensity} = this.props;
        return (6.022140e23 * volume * slope) / (1000 * lightIntensity);
    };

    getSelectedData = () => this.data.filter(point => point.isSelected).map( data => ({ x: data.time, y: data.concentration }));

    getUnselectedData = () => this.data.filter(point => !point.isSelected).map( data => ({ x: data.time, y: data.concentration }));

    getTrendData = () => {
        let data = this.getSelectedData();
        let trendFunc = getTrendResult(data).predictY;
        return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
    };

    getExportData = () => ({
        volume: this.props.volume,
        lightIntensity: this.props.lightIntensity,
        finalData: this.data.filter(point => point.isSelected),
        quantumYield: this.quantumYield,
        confidenceInterval: this.confidenceInterval
    });

    getChartProps = () => {
        const xArray = this.data.map(point => point.time);
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
                    `Time: ${tooltipItem.xLabel} sec`,
                ],
                xLabel: 'Time, sec',
                yLabel: 'Concentration, M',
                xTicksMin: suggestMinValue(xArray),
                xTicksMax: suggestMaxValue(xArray)
            })
        };
    };

    render() {
        const { classes, previousPage } = this.props;
        return (
            <div>
                <h3 className="my-3 text-center">Quantum yield</h3>
                <h5 className="text-center">Final chart</h5>
                <div  className="d-flex flex-row justify-content-center">
                    <div style={{width: 700, height: 600}}>
                        <Line {...this.getChartProps()}/>
                        <div style={{marginLeft: '5rem'}}>
                            <Equation slope={this.result.slope} intercept={this.result.intercept}/>
                            <br/>
                            <RSquared rSquared={this.result.rSquared}/>
                            <br/>
                            <span style={{fontFamily: 'KaTeX_Math'}}>Confidence interval: 95%</span>
                            <br/>
                            <Result name={'Quantum Yield'}
                                    value={this.quantumYield}
                                    error={this.confidenceInterval}
                            />
                        </div>
                        <div className='d-flex flex-row justify-content-between'>
                            <BackButton onClick={previousPage}/>
                            <CopyButton text={createQuantumYieldTSVFile({data: this.getExportData()})}/>
                            <SavePatternButton patternType={ExcelPatternTypes.QUANTUM_YIELD}/>
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