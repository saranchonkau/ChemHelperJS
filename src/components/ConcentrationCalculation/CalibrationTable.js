import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import { withStyles } from 'material-ui/styles';
import {reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {getInitialData} from "../../utils/Data";
import RemoveRowRenderer from '../../utils/cellRenderers/RemoveRowRenderer';
import CheckBoxRenderer from '../../utils/cellRenderers/CheckBoxRenderer';
import {cellStyle, suppressProps} from "../App/StyleConstants";
import {cloneDeep} from "lodash";
import {numberParser} from "../../utils/utils";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';

const styles = theme => ({});

const CalibrationTableWrapper = ({form, ...rest}) => {
    class CalibrationTable extends Component {
        constructor(props) {
            super(props);
            this.state = {
                data: cloneDeep(props.data)
            };
            this.gridOptions = {
                columnDefs: [
                    { headerName: '№', field: 'id', width: 70, cellStyle: cellStyle, ...suppressProps, unSortIcon: true },
                    { headerName: 'Concentration', field: 'concentration', width: 165, editable: true, cellStyle: cellStyle, valueParser: numberParser, unSortIcon: true, ...suppressProps},
                    { headerName: 'Optical Density', field: 'density', width: 175, editable: true, cellStyle: cellStyle, valueParser: numberParser, unSortIcon: true, ...suppressProps},
                    { colId: 'checkbox', headerName: 'On/Off', width: 90, cellRendererFramework: CheckBoxRenderer, cellStyle: cellStyle, ...suppressProps},
                    { width: 20, cellRendererFramework: RemoveRowRenderer, cellStyle: cellStyle, cellClass: 'no-border', ...suppressProps}
                ],
                icons: {
                    sortAscending: '<i class="fa fa-sort-asc" style="color: black" />',
                    sortDescending: '<i class="fa fa-sort-desc" style="color: black"/>',
                    sortUnSort: '<i class="fa fa-sort" style="color: gray"/>'
                },
                enableSorting: true,
                singleClickEdit: true,
                stopEditingWhenGridLosesFocus: true,
                enterMovesDownAfterEdit: true,
                suppressRowClickSelection: true,
                rowSelection: 'multiple',
                onSelectionChanged: ({api}) => api.refreshCells({ columns: ['checkbox'], force: true }),
                onRowDataChanged: ({api}) => this.checkNodeSelection(api),
                onRowDataUpdated: (params) => {
                    this.setState({data: this.getRowData()});
                },
                headerHeight: 50,
                rowHeight: 30
            };
        }

        getRowData = () => {
            let array = [];
            this.gridApi.forEachNode(node => array.push({...node.data, isSelected: node.selected}));
            return array;
        };

        onGridReady = params => {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
            this.checkNodeSelection(this.gridApi);
        };

        checkNodeSelection = gridApi => {
            gridApi.forEachNode(node => {
                if (node.data.isSelected) {
                    node.setSelected(true);
                }
            });
        };

        addRow = () => {
            const rowData = this.getRowData();
            const newRow = {
                id: Math.max.apply(null, rowData.map(data => data.id)) + 1,
                concentration: 0.0,
                density: 0.0,
                isSelected: true
            };
            this.setState({data: [...rowData, newRow]});
        };

        getTableHeight = dataLength => 64 + dataLength * 30.5;

        nextPage = () => {
            this.props.change('initialData', this.getRowData());
            this.props.nextPage();
        };

        render() {
            let { classes, previousPage, title } = this.props;
            return (
                <React.Fragment>
                    <h3 className="my-3 text-center">{title}</h3>
                    <h5 className="text-center">Calibration table</h5>
                    <div className='d-flex justify-content-center'>
                        <div style={{width: 540}}>
                            <div className="ag-theme-blue" style={{height: this.getTableHeight(this.state.data.length)}}>
                                <AgGridReact
                                    rowData={this.state.data}
                                    onGridReady={this.onGridReady}
                                    gridOptions={this.gridOptions}
                                />
                            </div>
                            <div className='d-flex flex-row justify-content-between'>
                                <BackButton onClick={previousPage}/>
                                <AddRowButton onClick={this.addRow}/>
                                <NextButton onClick={this.nextPage}/>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

    CalibrationTable = connect(
        state => ({
            data: getFormValues(form)(state).initialData
        })
    )(CalibrationTable);

    CalibrationTable = reduxForm({
        form: form, // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    })(withStyles(styles)(CalibrationTable));

    return <CalibrationTable {...rest}/>
};

export default CalibrationTableWrapper;