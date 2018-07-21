import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import {
    Equation, ExcelPatternTypes, getTrendResult, ReduxForms, Result, RSquared, suggestMaxValue, suggestMinValue,
    Units
} from "../../utils/utils";
import {chartOptions, datasets} from "../../utils/charts";
import BackButton from '../Others/BackButton';
import isElectron from 'is-electron';
import {createYieldTSVFile} from "../../utils/excel/radChemYield";
import CopyButton from "../Others/CopyButton";
import SavePatternButton from "../Others/SavePatternButton";

const styles = theme => ({});

class FinalChart extends Component {

    constructor(props){
        super(props);
        let {doseRate, finalData} = props;
        this.data = finalData.map(point => ({ ...point, dose: doseRate * 60 * point.time }));
        this.result = getTrendResult(this.getSelectedData());
        this.yield = this.calculateYield(this.result.slope);
        this.confidenceInterval = this.result.slopeConfidenceInterval && this.calculateYield(this.result.slopeConfidenceInterval);
    }

    calculateYield = slope => {
        let coefficient = 6.022140e6 * 1.602176;
        let yieldPerJoule = slope / this.props.solutionDensity;
        return this.props.unit === Units.moleculesPerHundredVolt ?
            yieldPerJoule * coefficient : yieldPerJoule;
    };

    getSelectedData = () => {
        return this.data.filter(point => point.isSelected)
            .map( data => ({ x: data.dose, y: data.concentration }) );
    };

    getUnselectedData = () => {
        return this.data.filter(point => !point.isSelected)
            .map( data => ({ x: data.dose, y: data.concentration }) );
    };

    getTrendData = () => {
        let data = this.getSelectedData();
        let trendFunc = getTrendResult(data).predictY;
        return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
    };

    getExportData = () => ({
        ...this.props.allValues,
        finalData: this.data.filter(point => point.isSelected),
        yield: this.yield,
        confidenceInterval: this.confidenceInterval
    });

    getChartProps = () => {
        const xArray = this.data.map(point => point.dose);
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
                    `Absorbed dose: ${tooltipItem.xLabel} Gray`,
                ],
                xLabel: 'Absorbed dose, Gray',
                yLabel: 'Concentration, M',
                xTicksMin: suggestMinValue(xArray),
                xTicksMax: suggestMaxValue(xArray)
            }),
            redraw: true
        };
    };

    render() {
        const { classes, previousPage } = this.props;
        return (
            <div>
                <h3 className="my-3 text-center">Radiation chemical yield</h3>
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
                            <Result name={'Yield'}
                                    value={this.yield}
                                    error={this.confidenceInterval}
                                    unit={this.props.unit}
                            />
                        </div>
                        <div className='d-flex flex-row justify-content-between'>
                            <BackButton onClick={previousPage}/>
                            <CopyButton text={createYieldTSVFile({data: this.getExportData()})}/>
                            <SavePatternButton patternType={ExcelPatternTypes.RAD_CHEM_YIELD}/>
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
        allValues: getFormValues(ReduxForms.Yield)(state)
    })
)(FinalChart);

export default reduxForm({
    form: ReduxForms.Yield,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
})(withStyles(styles)(FinalChart));