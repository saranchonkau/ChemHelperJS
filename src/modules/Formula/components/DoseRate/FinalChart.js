import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Equation,
  ExcelPatternTypes,
  getTrendResult,
  ReduxForms,
  Result,
  RSquared,
  suggestMaxValue,
  suggestMinValue,
  Units,
} from 'utils/utils';
import { chartOptions, datasets } from 'utils/charts';
import BackButton from 'components/BackButton';
import SavePatternButton from 'components/SavePatternButton';
import CopyButton from 'components/CopyButton';
import { createDoseRateTSVFile } from 'utils/excel/doseRate';

const styles = theme => ({});

class FinalChart extends Component {
  constructor(props) {
    super(props);
    let { finalData } = props;
    this.data = finalData.map(point => ({ ...point, time: point.time * 60 }));
    this.result = getTrendResult(this.getSelectedData());
    this.doseRate = this.calculateDoseRate(this.result.slope);
    this.confidenceInterval =
      this.result.slopeConfidenceInterval &&
      this.calculateDoseRate(this.result.slopeConfidenceInterval);
  }

  calculateDoseRate = slope => {
    let coefficient = 6.02214e6 * 1.602176;
    let yieldPerJoule =
      slope / (this.props.solutionDensity * this.props.radYield);
    return this.props.unit === Units.moleculesPerHundredVolt
      ? yieldPerJoule * coefficient
      : yieldPerJoule;
  };

  getSelectedData = () => {
    return this.data
      .filter(point => point.isSelected)
      .map(data => ({ x: data.time, y: data.concentration }));
  };

  getUnselectedData = () => {
    return this.data
      .filter(point => !point.isSelected)
      .map(data => ({ x: data.time, y: data.concentration }));
  };

  getTrendData = () => {
    let data = this.getSelectedData();
    let trendFunc = getTrendResult(data).predictY;
    return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
  };

  getExportData = () => ({
    ...this.props.allValues,
    finalData: this.data.filter(point => point.isSelected),
    doseRate: this.doseRate,
    confidenceInterval: this.confidenceInterval,
  });

  getChartProps = () => {
    const xArray = this.data.map(point => point.time);
    return {
      data: {
        datasets: [
          datasets.selectedData({ data: this.getSelectedData() }),
          datasets.unselectedData({ data: this.getUnselectedData() }),
          datasets.trendData({ data: this.getTrendData() }),
        ],
      },
      options: chartOptions({
        tooltipLabelCallback: (tooltipItem, data) => [
          `Concentration: ${tooltipItem.yLabel} mol/l`,
          `Time: ${tooltipItem.xLabel} sec`,
        ],
        xLabel: 'Time, sec',
        yLabel: 'Concentration, M',
        xTicksMin: suggestMinValue(xArray),
        xTicksMax: suggestMaxValue(xArray),
      }),
    };
  };

  render() {
    let { classes, previousPage } = this.props;
    return (
      <div>
        <h3 className="my-3 text-center">Dose rate</h3>
        <h5 className="text-center">Final chart</h5>
        <div className="d-flex flex-row justify-content-center">
          <div style={{ width: 700, height: 600 }}>
            <Line {...this.getChartProps()} />
            <div style={{ marginLeft: '5rem' }}>
              <Equation
                slope={this.result.slope}
                intercept={this.result.intercept}
              />
              <br />
              <RSquared rSquared={this.result.rSquared} />
              <br />
              <span style={{ fontFamily: 'KaTeX_Math' }}>
                Confidence interval: 95%
              </span>
              <br />
              <Result
                name={'DoseRate'}
                value={this.doseRate}
                error={this.confidenceInterval}
                unit={'Gy/s'}
              />
            </div>
            <div className="d-flex flex-row justify-content-between">
              <BackButton onClick={previousPage} />
              <CopyButton
                text={createDoseRateTSVFile({ data: this.getExportData() })}
              />
              <SavePatternButton patternType={ExcelPatternTypes.DOSE_RATE} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FinalChart = connect(state => ({
  finalData: getFormValues(ReduxForms.DoseRate)(state).finalData,
  radYield: getFormValues(ReduxForms.DoseRate)(state).radYield,
  solutionDensity: getFormValues(ReduxForms.DoseRate)(state).solutionDensity,
  unit: getFormValues(ReduxForms.DoseRate)(state).unit,
  allValues: getFormValues(ReduxForms.DoseRate)(state),
}))(FinalChart);

export default reduxForm({
  form: ReduxForms.DoseRate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(withStyles(styles)(FinalChart));
