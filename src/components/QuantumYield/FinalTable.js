import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {calculateRowId, ReduxForms} from "../../utils/utils";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';
import MaterialNumberInput from "../Others/MaterialNumberInput";
import {finalTableColumnDefs} from "../../constants/index";
import Grid from "../Grid/Grid";

const styles = theme => ({});

class FinalTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.finalData,
            lightIntensity: props.lightIntensity,
            lightIntensityError: '',
            volume: props.volume,
            volumeError: ''
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
            isSelected: true
        };
        this.api.createRow(newRow);
    };

    nextPage = () => {
        const {volume, lightIntensity} = this.state;
        this.props.change('finalData', this.api.getRowData());
        this.props.change('volume', Number.parseFloat(volume));
        this.props.change('lightIntensity', Number.parseFloat(lightIntensity));
        this.props.nextPage();
    };

    previousPage = () => {
        this.props.change('finalData', this.api.getRowData());
        this.props.previousPage();
    };

    handleNumberChange = name => ({ value, error }) => this.setState({ [name]: value, [`${name}Error`]: error });

    isCorrectData = () => {
        const { volume, volumeError, lightIntensity, lightIntensityError } = this.state;
        return ( volume && lightIntensity ) && ( !volumeError && !lightIntensityError );
    };

    render() {
        const { volume, volumeError, lightIntensity, lightIntensityError, data } = this.state;
        let { classes, previousPage } = this.props;
        return (
            <div>
                <h3 className="my-3 text-center">Quantum yield</h3>
                <h5 className="text-center">Final table</h5>
                <div className='d-flex justify-content-center'>
                    <div>
                        <Grid data={this.state.data}
                              options={{ columnDefs: finalTableColumnDefs }}
                              onGridReady={this.onGridReady}
                        />
                        <div className='d-flex flex-row justify-content-between'>
                            <BackButton onClick={this.previousPage}/>
                            <AddRowButton onClick={this.addRow}/>
                            <NextButton onClick={this.nextPage} disabled={!this.isCorrectData()}/>
                        </div>
                        <h5 className="my-3 text-center">Enter parameters for calculating quantum yield:</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{width: 130}}>Light intensity I (photon/s):</td>
                                    <td>
                                        <MaterialNumberInput id={'lightIntensity-input'}
                                                               initialValue={lightIntensity}
                                                               onChange={this.handleNumberChange('lightIntensity')}
                                                               error={lightIntensityError}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Volume V (ml):</td>
                                    <td>
                                        <MaterialNumberInput id={'volume-input'}
                                                             initialValue={volume}
                                                             onChange={this.handleNumberChange('volume')}
                                                             error={volumeError}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

FinalTable = connect(
    state => ({
        trendFunc: getFormValues(ReduxForms.QuantumYield)(state).trendFunc,
        finalData: getFormValues(ReduxForms.QuantumYield)(state).finalData,
        lightIntensity: getFormValues(ReduxForms.QuantumYield)(state).lightIntensity,
        volume: getFormValues(ReduxForms.QuantumYield)(state).volume,
    })
)(FinalTable);

export default reduxForm({
    form: ReduxForms.QuantumYield,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
})(withStyles(styles)(FinalTable));