import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { getInitialData } from 'utils/Data';
import { calculateRowId, ExcelPatternTypes, PageNumbers } from 'utils/utils';
import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import MaterialButton from 'components/MaterialButton';
import SavePatternButton from 'components/SavePatternButton';
import CopyButton from 'components/CopyButton';
import { createOpticalDensityTableTSVFile } from 'utils/excel/opticalDensityTable';
import MaterialNumberInput from 'components/MaterialNumberInput';
import Grid from 'components/Grid/Grid';
import { calculationWithMACColumnDefs } from 'constants/common';

export const styles = theme => ({});

const CalculationWithMACWrapper = ({ form, ...rest }) => {
  class CalculationWithMAC extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: props.data,
        pathLength: props.pathLength,
        pathLengthError: '',
        MAC: props.MAC,
        MACError: '',
      };
    }

    onGridReady = api => {
      this.api = api;
    };

    addRow = () => {
      const rowData = this.api.getRowData();
      const newRow = {
        id: calculateRowId(rowData.map(data => data.id)),
        density: 0.0,
        isSelected: true,
      };
      this.api.createRow(newRow);
    };

    modifyFinalData = () => {
      return this.api.getRowData().map(point => {
        const foundPoint = this.props.finalData.find(
          finalPoint => finalPoint.id === point.id,
        );
        return {
          id: point.id,
          time: foundPoint ? foundPoint.time : 0.0,
          concentration:
            point.density / (this.state.pathLength * this.state.MAC),
          density: point.density,
          isSelected: true,
        };
      });
    };

    getOpticalDensityData = () => {
      return this.api
        ? this.api.getRowData().map(point => ({
            ...point,
            concentration:
              point.density / (this.state.pathLength * this.state.MAC),
          }))
        : [];
    };

    getExportData = () => ({
      opticalDensityData: this.getOpticalDensityData(),
      pathLength: this.state.pathLength,
      MAC: this.state.MAC,
    });

    nextPage = () => {
      this.props.change('finalData', this.modifyFinalData());
      this.props.change('opticalDensityData', this.getOpticalDensityData());
      this.props.change('pathLength', Number.parseFloat(this.state.pathLength));
      this.props.change('MAC', Number.parseFloat(this.state.MAC));
      this.props.goToPage(PageNumbers.FINAL_TABLE);
    };

    previousPage = () => {
      this.props.change('pathLength', 0);
      this.props.change('MAC', 0);
      this.props.previousPage();
    };

    handleNumberChange = name => ({ value, error }) =>
      this.setState({ [name]: value, [`${name}Error`]: error });

    isCorrectData = () => {
      const { pathLength, pathLengthError, MAC, MACError } = this.state;
      return pathLength && MAC && (!pathLengthError && !MACError);
    };

    render() {
      const { classes, title } = this.props;
      const { pathLength, MAC, data } = this.state;
      return (
        <React.Fragment>
          <h3 className="my-3 text-center">{title}</h3>
          <h5 className="text-center">
            Calculation with molar extinction coefficient
          </h5>
          <div className="d-flex justify-content-center">
            <div style={{ width: 600 }}>
              <Grid
                data={this.state.data}
                options={{ columnDefs: calculationWithMACColumnDefs }}
                onGridReady={this.onGridReady}
              />
              <div className="d-flex flex-row justify-content-between">
                <BackButton onClick={this.previousPage} />
                <MaterialButton
                  text={'Calculate concentrations'}
                  onClick={() =>
                    this.setState({ data: this.getOpticalDensityData() })
                  }
                  disabled={!this.isCorrectData() || data.length === 0}
                />
                <AddRowButton onClick={this.addRow} />
                <NextButton
                  onClick={this.nextPage}
                  disabled={!this.isCorrectData()}
                />
              </div>
              <h5 className="my-3 text-center">
                Enter parameters for calculating concentrations:
              </h5>
              <table>
                <tbody>
                  <tr>
                    <td>Path length (cm):</td>
                    <td>
                      <MaterialNumberInput
                        id={'pathLength-input'}
                        initialValue={pathLength}
                        onChange={this.handleNumberChange('pathLength')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: 200 }}>
                      Molar attenuation coefficient &#949; (l/(mol&middot;cm)):
                    </td>
                    <td>
                      <MaterialNumberInput
                        id={'MAC-input'}
                        initialValue={MAC}
                        onChange={this.handleNumberChange('MAC')}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex justify-content-end">
                <CopyButton
                  text={createOpticalDensityTableTSVFile({
                    data: this.getExportData(),
                  })}
                  disabled={!this.isCorrectData()}
                />
                <SavePatternButton
                  patternType={ExcelPatternTypes.OPTICAL_DENSITY_TABLE}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }

  CalculationWithMAC = connect(state => ({
    data: getFormValues(form)(state).opticalDensityData,
    pathLength: getFormValues(form)(state).pathLength,
    MAC: getFormValues(form)(state).MAC,
    finalData: getFormValues(form)(state).finalData,
  }))(CalculationWithMAC);

  CalculationWithMAC = reduxForm({
    form: form,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
  })(withStyles(styles)(CalculationWithMAC));

  return <CalculationWithMAC {...rest} />;
};

export default CalculationWithMACWrapper;
