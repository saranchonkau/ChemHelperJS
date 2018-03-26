import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import { withStyles } from 'material-ui/styles';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {ReduxForms} from "../../utils/utils";
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
            lightIntensity: props.lightIntensity,
            lightIntensityError: '',
            volume: props.volume,
            volumeError: ''
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
            id: Math.max.apply(null, rowData.map(data => data.id)) + 1,
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
        const {unit, volume, lightIntensity} = this.state;
        this.props.change('finalData', this.getRowData());
        this.props.change('volume', volume);
        this.props.change('lightIntensity', lightIntensity);
        this.props.nextPage();
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
        const { volume, volumeError, lightIntensity, lightIntensityError } = this.state;
        return ( volume && lightIntensity ) && ( !volumeError && !lightIntensityError );
    };

    render() {
        const { volume, volumeError, lightIntensity, lightIntensityError, data } = this.state;
        let { classes, previousPage } = this.props;
        return (
            <div>
                <h3 className="my-3 text-center">Quantum yield calculation</h3>
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
                            <BackButton onClick={previousPage}/>
                            <AddRowButton onClick={this.addRow}/>
                            <NextButton onClick={this.nextPage} disabled={!this.isCorrectData()}/>
                        </div>
                        <h5 className="my-3 text-center">Enter parameters for calculating quantum yield:</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{width: 130}}>Light intensity I (photon/s):</td>
                                    <td>
                                        <ControlledNumberInput id={'lightIntensity-input'}
                                                               value={lightIntensity}
                                                               onChange={this.handleNumberChange('lightIntensity')}
                                                               error={lightIntensityError}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Volume V (ml):</td>
                                    <td>
                                        <ControlledNumberInput id={'volume-input'}
                                                               value={volume}
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