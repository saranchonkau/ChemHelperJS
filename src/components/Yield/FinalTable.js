import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import { withStyles } from 'material-ui/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import {calculateRowId, ReduxForms, Units} from "../../utils/utils";
import numeral from 'numeral';
import RemoveRowRenderer from '../../utils/cellRenderers/RemoveRowRenderer';
import {cellStyle, suppressProps} from "../App/StyleConstants";
import CheckBoxRenderer from "../../utils/cellRenderers/CheckBoxRenderer";
import {cloneDeep} from "lodash";
import {numberParser} from "../../utils/utils";
import ControlledNumberInput from "../Others/ControlledInput";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';

const styles = theme => ({});

class FinalTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: cloneDeep(props.finalData),
            solutionDensity: props.solutionDensity,
            solutionDensityError: '',
            doseRate: props.doseRate,
            doseRateError: '',
            unit: props.unit
        };
        this.gridOptions = {
            columnDefs: [
                { headerName: '№', field: 'id', width: 70, cellStyle: cellStyle, ...suppressProps, unSortIcon: true },
                { unSortIcon: true,
                    headerName: 'Time, min',
                    field: 'time',
                    editable: true,
                    width: 130,
                    cellStyle: cellStyle,
                    valueParser: numberParser
                },
                { headerName: 'Concentration', field: 'concentration', width: 165, editable: true, cellStyle: cellStyle,
                    valueParser: numberParser, unSortIcon: true, ...suppressProps,
                    valueFormatter: params => {
                        if (Number.isNaN(params.value)) {
                            return params.value;
                        } else {
                            return numeral(params.value).format('0.00000e+0');
                        }
                    }
                },
                { colId: 'checkbox', headerName: 'On/Off', width: 90, cellRendererFramework: CheckBoxRenderer, cellStyle: cellStyle, ...suppressProps},
                { width: 20, cellRendererFramework: RemoveRowRenderer, cellStyle: cellStyle, cellClass: 'no-border', ...suppressProps}
            ],
            icons: {
                sortAscending: '<i class="fa fa-sort-asc" style="color: black" />',
                sortDescending: '<i class="fa fa-sort-desc" style="color: black"/>',
                sortUnSort: '<i class="fa fa-sort" style="color: gray"/>',
            },
            enableSorting: true,
            singleClickEdit: true,
            stopEditingWhenGridLosesFocus: true,
            enterMovesDownAfterEdit: true,
            suppressRowClickSelection: true,
            rowSelection: 'multiple',
            onSelectionChanged: ({api}) => api.refreshCells({ columns: ['checkbox'], force: true }),
            onRowDataChanged: ({api}) => {
                console.log('Row data changed');
                this.checkNodeSelection(api);
            },
            onRowDataUpdated: (params) => {
                console.log('Row data updated: ', params);
                this.setState({data: this.getRowData()});
            },
            headerHeight: 50,
            rowHeight: 30
        };
    }

    checkNodeSelection = gridApi => {
        gridApi.forEachNode(node => {
            if (node.data.isSelected) {
                node.setSelected(true);
            }
        });
    };

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.checkNodeSelection(this.gridApi);
    };

    addRow = () => {
        const rowData = this.getRowData();
        const newRow = {
            id: calculateRowId(rowData.map(data => data.id)),
            concentration: 0.0,
            time: 0.0,
            isSelected: true
        };
        this.setState({data: [...rowData, newRow]});
    };

    getRowData = () => {
        let array = [];
        this.gridApi.forEachNode(node => array.push({...node.data, isSelected: node.selected}));
        return array;
    };

    getTableHeight = dataLength => 64 + dataLength * 30.5;

    nextPage = () => {
        let {unit, doseRate, solutionDensity} = this.state;
        this.props.change('finalData', this.getRowData());
        this.props.change('unit', unit);
        this.props.change('doseRate', doseRate);
        this.props.change('solutionDensity', solutionDensity);
        this.props.nextPage();
    };

    previousPage = () => {
        this.props.change('finalData', this.getRowData());
        this.props.previousPage();
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleNumberChange = name => event => {
        let initialValue = event.target.value;
        const parsedValue = Number.parseFloat(initialValue);
        if (Number.isNaN(parsedValue)) {
            this.setState({
                [name]: initialValue,
                [`${name}Error`]: 'It must be a number',
            });
        } else {
            this.setState({
                [name]: parsedValue,
                [`${name}Error`]: '',
            });
        }
    };

    isCorrectData = () => {
        const { solutionDensity, solutionDensityError, doseRate, doseRateError } = this.state;
        return ( solutionDensity && doseRate ) && ( !solutionDensityError && !doseRateError );
    };

    render() {
        let { classes, previousPage } = this.props;
        const { doseRate, doseRateError, solutionDensity, solutionDensityError, unit, data } = this.state;
        return (
            <div>
                <h3 className="my-3 text-center">Radiation chemistry yield from chart</h3>
                <h5 className="text-center">Final table</h5>
                <div className='d-flex justify-content-center'>
                    <div style={{width: 500}}>
                        <div className="ag-theme-blue" style={{height: this.getTableHeight(data.length)}}>
                            <AgGridReact
                                rowData={data}
                                onGridReady={this.onGridReady}
                                gridOptions={this.gridOptions}
                            />
                        </div>
                        <div className='d-flex flex-row justify-content-between'>
                            <BackButton onClick={this.previousPage}/>
                            <AddRowButton onClick={this.addRow}/>
                            <NextButton onClick={this.nextPage} disabled={!this.isCorrectData()}/>
                        </div>
                        <h5 className="my-3 text-center">Enter parameters for calculating yield:</h5>
                        <table>
                            <tbody>
                            <tr>
                                <td>Solution density &rho; (g/ml):</td>
                                <td>
                                    <ControlledNumberInput id={'solutionDensity-input'}
                                                           value={solutionDensity}
                                                           onChange={this.handleNumberChange('solutionDensity')}
                                                           error={solutionDensityError}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Dose rate P (Gy/s):</td>
                                <td>
                                    <ControlledNumberInput id={'doseRate-input'}
                                                     value={doseRate}
                                                     onChange={this.handleNumberChange('doseRate')}
                                                     error={doseRateError}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{width: 200}}>Unit of measure of yield:</td>
                                <td>
                                    <Select value={unit} onChange={this.handleChange('unit')}>
                                        <MenuItem value={Units.moleculesPerHundredVolt}>{Units.moleculesPerHundredVolt}</MenuItem>
                                        <MenuItem value={Units.molPerJoule}>{Units.molPerJoule}</MenuItem>
                                    </Select>
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
        finalData: getFormValues(ReduxForms.Yield)(state).finalData,
        doseRate: getFormValues(ReduxForms.Yield)(state).doseRate,
        solutionDensity: getFormValues(ReduxForms.Yield)(state).solutionDensity,
        unit: getFormValues(ReduxForms.Yield)(state).unit
    })
)(FinalTable);

export default reduxForm({
    form: ReduxForms.Yield,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
})(withStyles(styles)(FinalTable));