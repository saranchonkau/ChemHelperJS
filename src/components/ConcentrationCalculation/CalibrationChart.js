import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';
import {ExcelPatternTypes, getTrendResult, RSquared, suggestMaxValue, suggestMinValue} from "../../utils/utils";
import {Equation} from "../../utils/utils";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import {chartOptions, datasets} from "../../utils/charts";
import CopyButton from "../Others/CopyButton";
import SavePatternButton from "../Others/SavePatternButton";
import {createCalibrationTableTSVFile} from "../../utils/excel/calibrationTable";

const styles = theme => ({});

const CalibrationChartWrapper = ({ form, ...rest }) => {
    class CalibrationChart extends Component {

        getExportData = () => this.props.data.filter(point => point.isSelected);

        getSelectedData = () => {
            return this.props.data.filter(point => point.isSelected)
                .map( data => ({ x: data.concentration, y: data.density }) );
        };

        getUnselectedData = () => {
            return this.props.data.filter(point => !point.isSelected)
                .map( data => ({ x: data.concentration, y: data.density }) );
        };

        getTrendData = () => {
            let data = this.getSelectedData();
            let trendFunc = getTrendResult(data).predictY;
            return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
        };

        nextPage = () => {
            let data = this.getSelectedData();
            this.props.change('trendFunc', getTrendResult(data).predictX);
            this.props.nextPage();
        };

        getChartProps = () => {
            const xArray = this.props.data.map(point => point.concentration);
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
                        `Optical density: ${tooltipItem.yLabel}`,
                        `Concentration: ${tooltipItem.xLabel} mol/l`,
                    ],
                    xLabel: 'Concentration, M',
                    yLabel: 'Optical density, D',
                    xTicksMin: suggestMinValue(xArray),
                    xTicksMax: suggestMaxValue(xArray)
                })
            };
        };

        render() {
            const { classes, previousPage, title } = this.props;
            const result = getTrendResult(this.getSelectedData());
            return (
                <div>
                    <h3 className="my-3 text-center">{title}</h3>
                    <h5 className="text-center">Calibration chart</h5>
                    <div  className="d-flex flex-row justify-content-center">
                        <div style={{width: 700, height: '100%'}}>
                            <Line {...this.getChartProps()}/>
                            <Equation slope={result.slope} intercept={result.intercept}/><br/>
                            <RSquared rSquared={result.rSquared}/>
                            <div className='d-flex flex-row justify-content-between'>
                                <BackButton onClick={previousPage}/>
                                <CopyButton text={createCalibrationTableTSVFile({data: this.getExportData()})}/>
                                <SavePatternButton patternType={ExcelPatternTypes.CALIBRATION_TABLE}/>
                                <NextButton onClick={this.nextPage}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    CalibrationChart = connect(
        state => ({
            data: getFormValues(form)(state).initialData
        })
    )(CalibrationChart);

    CalibrationChart = reduxForm({
        form: form,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    })(withStyles(styles)(CalibrationChart));

    return <CalibrationChart {...rest}/>
};

export default CalibrationChartWrapper;