import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import { calculateRowId, ReduxForms, Units } from 'utils/utils';
import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import MaterialNumberInput from 'components/MaterialNumberInput';
import { finalTableColumnDefs } from 'constants/common';
import Grid from 'components/Grid/Grid';

export const styles = theme => ({});

class FinalTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.finalData,
      solutionDensity: props.solutionDensity,
      solutionDensityError: '',
      radYield: props.radYield,
      radYieldError: '',
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
    let { unit, radYield, solutionDensity } = this.state;
    this.props.change('finalData', this.api.getRowData());
    this.props.change('unit', unit);
    this.props.change('radYield', Number.parseFloat(radYield));
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
      radYield,
      radYieldError,
    } = this.state;
    return (
      solutionDensity && radYield && (!solutionDensityError && !radYieldError)
    );
  };

  render() {
    let { classes, previousPage } = this.props;
    const { radYield, solutionDensity, unit, data } = this.state;
    return (
      <div>
        <h3 className="my-3 text-center">Dose rate</h3>
        <h5 className="text-center">Final table</h5>
        <div className="d-flex flex-row justify-content-center">
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
              Enter parameters for calculating dose rate:
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
                  <td>{`Yield G : (${unit})`}</td>
                  <td>
                    <MaterialNumberInput
                      id={'radYield-input'}
                      initialValue={radYield}
                      onChange={this.handleNumberChange('radYield')}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ width: 200 }}>Unit of measure of yield:</td>
                  <td>
                    <Select
                      value={this.state.unit}
                      onChange={this.handleChange('unit')}
                    >
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

const formSelector = state => getFormValues(ReduxForms.DoseRate)(state);

FinalTable = connect(state => ({
  finalData: formSelector(state).finalData,
  radYield: formSelector(state).radYield,
  solutionDensity: formSelector(state).solutionDensity,
  unit: formSelector(state).unit,
}))(FinalTable);

export default reduxForm({
  form: ReduxForms.DoseRate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(withStyles(styles)(FinalTable));
