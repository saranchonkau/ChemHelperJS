import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { MenuItem, Select } from '@material-ui/core';
import { calculateRowId, ReduxForms, Units } from 'utils/utils';
import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import MaterialNumberInput from 'components/MaterialNumberInput';
import Grid from 'components/Grid/Grid';
import { finalTableColumnDefs } from 'constants/common';

const styles = theme => ({});

class FinalTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.finalData,
      solutionDensity: props.solutionDensity,
      solutionDensityError: '',
      doseRate: props.doseRate,
      doseRateError: '',
      unit: props.unit,
    };
  }

  onGridReady = api => {
    this.api = api;
  };

  addRow = () => {
    const rowData = this.api.getRowData();
    const newRow = {
      id: calculateRowId(rowData.map(data => data.id)),
      concentration: 0.0,
      time: 0.0,
      isSelected: true,
    };
    this.api.createRow(newRow);
  };

  nextPage = () => {
    let { unit, doseRate, solutionDensity } = this.state;
    this.props.change('finalData', this.api.getRowData());
    this.props.change('unit', unit);
    this.props.change('doseRate', Number.parseFloat(doseRate));
    this.props.change('solutionDensity', Number.parseFloat(solutionDensity));
    this.props.nextPage();
  };

  previousPage = () => {
    this.props.change('finalData', this.api.getRowData());
    this.props.previousPage();
  };

  handleChange = name => event => this.setState({ [name]: event.target.value });

  handleNumberChange = name => ({ value, error }) =>
    this.setState({ [name]: value, [`${name}Error`]: error });

  isCorrectData = () => {
    const {
      solutionDensity,
      solutionDensityError,
      doseRate,
      doseRateError,
    } = this.state;
    return (
      solutionDensity && doseRate && (!solutionDensityError && !doseRateError)
    );
  };

  render() {
    let { classes, previousPage } = this.props;
    const { doseRate, solutionDensity, unit, data } = this.state;
    return (
      <div>
        <h3 className="my-3 text-center">Radiation chemical yield</h3>
        <h5 className="text-center">Final table</h5>
        <div className="d-flex justify-content-center">
          <div>
            <Grid
              data={this.state.data}
              options={{ columnDefs: finalTableColumnDefs }}
              onGridReady={this.onGridReady}
            />
            <div className="d-flex flex-row justify-content-between">
              <BackButton onClick={this.previousPage} />
              <AddRowButton onClick={this.addRow} />
              <NextButton
                onClick={this.nextPage}
                disabled={!this.isCorrectData()}
              />
            </div>
            <h5 className="my-3 text-center">
              Enter parameters for calculating yield:
            </h5>
            <table>
              <tbody>
                <tr>
                  <td>Solution density &rho; (g/ml):</td>
                  <td>
                    <MaterialNumberInput
                      id={'solutionDensity-input'}
                      initialValue={solutionDensity}
                      onChange={this.handleNumberChange('solutionDensity')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Dose rate P (Gy/s):</td>
                  <td>
                    <MaterialNumberInput
                      id={'doseRate-input'}
                      initialValue={doseRate}
                      onChange={this.handleNumberChange('doseRate')}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ width: 200 }}>Unit of measure of yield:</td>
                  <td>
                    <Select value={unit} onChange={this.handleChange('unit')}>
                      <MenuItem value={Units.moleculesPerHundredVolt}>
                        {Units.moleculesPerHundredVolt}
                      </MenuItem>
                      <MenuItem value={Units.molPerJoule}>
                        {Units.molPerJoule}
                      </MenuItem>
                    </Select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

FinalTable = connect(state => ({
  finalData: getFormValues(ReduxForms.Yield)(state).finalData,
  doseRate: getFormValues(ReduxForms.Yield)(state).doseRate,
  solutionDensity: getFormValues(ReduxForms.Yield)(state).solutionDensity,
  unit: getFormValues(ReduxForms.Yield)(state).unit,
}))(FinalTable);

export default reduxForm({
  form: ReduxForms.Yield,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(withStyles(styles)(FinalTable));
