import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import {
    Equation, getTrendResult, ReduxForms, Result, RSquared, suggestMaxValue, suggestMinValue,
    Units
} from "../../utils/utils";
import {chartOptions, datasets} from "../../utils/charts";
import BackButton from '../Others/BackButton';

const styles = theme => ({});

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

    getChartProps = () => {
        const xArray = this.state.data.map(point => point.dose);
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
            })
        };
    };

    render() {
        const { classes, previousPage } = this.props;
        const result = getTrendResult(this.getSelectedData());
        console.log('Trend result: ', result);
        return (
            <div>
                <h3 className="my-3 text-center">Radiation chemistry yield from chart</h3>
                <h5 className="text-center">Final chart</h5>
                <div  className="d-flex flex-row justify-content-center">
                    <div style={{width: 700, height: 600}}>
                        <Line {...this.getChartProps()}/>
                        <div style={{marginLeft: '5rem'}}>
                            <Equation slope={result.slope} intercept={result.intercept}/>
                            <br/>
                            <RSquared rSquared={result.rSquared}/>
                            <br/>
                            <span style={{fontFamily: 'KaTeX_Math'}}>Confidence interval: 95%</span>
                            <br/>
                            <Result name={'Yield'}
                                    value={this.calculateYield(result.slope)}
                                    error={this.calculateYield(result.slopeConfidenceInterval)}
                                    unit={this.props.unit}
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
        finalData: getFormValues(ReduxForms.Yield)(state).finalData,
        doseRate: getFormValues(ReduxForms.Yield)(state).doseRate,
        solutionDensity: getFormValues(ReduxForms.Yield)(state).solutionDensity,
        unit: getFormValues(ReduxForms.Yield)(state).unit,
    })
)(FinalChart);

export default reduxForm({
    form: ReduxForms.Yield,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
})(withStyles(styles)(FinalChart));