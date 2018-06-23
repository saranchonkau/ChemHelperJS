import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import { withStyles } from 'material-ui/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import {calculateRowId, numberFormatter, ReduxForms, Units} from "../../utils/utils";
import RemoveRowRenderer from '../../utils/cellRenderers/RemoveRowRenderer';
import {cellStyle, suppressProps} from "../App/StyleConstants";
import CheckBoxRenderer from "../../utils/cellRenderers/CheckBoxRenderer";
import {cloneDeep} from "lodash";
import {numberParser} from "../../utils/utils";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';
import MaterialNumberInput from "../Others/MaterialNumberInput";

export const styles = theme => ({});

class FinalTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: cloneDeep(props.finalData),
            solutionDensity: props.solutionDensity,
            solutionDensityError: '',
            radYield: props.radYield,
            radYieldError: '',
            unit: props.unit
        };
        this.gridOptions = {
            columnDefs: [
                { headerName: '№', field: 'id', width: 70, cellStyle: cellStyle, ...suppressProps, unSortIcon: true },
                { headerName: 'Time, min', field: 'time', width: 130, editable: true, cellStyle: cellStyle, valueParser: numberParser, ...suppressProps, unSortIcon: true},
                { headerName: 'Concentration', field: 'concentration', width: 165, editable: true, cellStyle: cellStyle,
                    valueParser: numberParser, unSortIcon: true, ...suppressProps, valueFormatter: numberFormatter
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
            onRowDataChanged: ({api}) => this.checkNodeSelection(api),
            onRowDataUpdated: () => this.setState({data: this.getRowData()}),
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
        let {unit, radYield, solutionDensity} = this.state;
        this.props.change('finalData', this.getRowData());
        this.props.change('unit', unit);
        this.props.change('radYield', Number.parseFloat(radYield));
        this.props.change('solutionDensity', Number.parseFloat(solutionDensity));
        this.props.nextPage();
    };

    previousPage = () => {
        this.props.change('finalData', this.getRowData());
        this.props.previousPage();
    };

    handleChange = name => event => this.setState({ [name]: event.target.value });

    handleNumberChange = name => ({ value, error }) => this.setState({ [name]: value, [`${name}Error`]: error });

    isCorrectData = () => {
        const { solutionDensity, solutionDensityError, radYield, radYieldError } = this.state;
        return ( solutionDensity && radYield ) && ( !solutionDensityError && !radYieldError );
    };

    render() {
        let { classes, previousPage } = this.props;
        const { radYield, radYieldError, solutionDensity, solutionDensityError, unit, data } = this.state;
        return (
            <div>
                <h3 className="my-3 text-center">Dose rate</h3>
                <h5 className="text-center">Final table</h5>
                <div className='d-flex flex-row justify-content-center'>
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
                        <h5 className="my-3 text-center">Enter parameters for calculating dose rate:</h5>
                        <table>
                            <tbody>
                            <tr>
                                <td>Solution density &rho; (g/ml):</td>
                                <td>
                                    <MaterialNumberInput id={'solutionDensity-input'}
                                                         initialValue={solutionDensity}
                                                         onChange={this.handleNumberChange('solutionDensity')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>{`Yield G : (${unit})`}</td>
                                <td>
                                    <MaterialNumberInput id={'radYield-input'}
                                                         initialValue={radYield}
                                                         onChange={this.handleNumberChange('radYield')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{width: 200}}>Unit of measure of yield:</td>
                                <td>
                                    <Select value={this.state.unit} onChange={this.handleChange('unit')}>
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

const formSelector = state => getFormValues(ReduxForms.DoseRate)(state);

FinalTable = connect(
    state => ({
        finalData: formSelector(state).finalData,
        radYield: formSelector(state).radYield,
        solutionDensity: formSelector(state).solutionDensity,
        unit: formSelector(state).unit
    })
)(FinalTable);

export default reduxForm({
    form: ReduxForms.DoseRate,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
})(withStyles(styles)(FinalTable));
