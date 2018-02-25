import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PlusOne from 'material-ui-icons/PlusOne';
import Forward from 'material-ui-icons/ArrowForward';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {ReduxForms, Units} from "../../utils/utils";
import {finalData, initialData} from "../../utils/Data";
import RemoveRowRenderer from '../../utils/cellRenderers/RemoveRowRenderer';
import CheckBoxRenderer from '../../utils/cellRenderers/CheckBoxRenderer';
import '../Yield/table.css';
import {cellStyle, suppressProps} from "../App/StyleConstants";

const numberParser = params => Number(params.newValue);

export const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

class CalibrationTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
        this.gridOptions = {
            columnDefs: [
                { headerName: '№', field: 'id', width: 70, cellStyle: cellStyle, ...suppressProps, unSortIcon: true },
                { headerName: 'Concentration', field: 'concentration', width: 165, editable: true, cellStyle: cellStyle, valueParser: numberParser, unSortIcon: true, ...suppressProps},
                { headerName: 'Optical Dencity', field: 'dencity', width: 175, editable: true, cellStyle: cellStyle, valueParser: numberParser, unSortIcon: true, ...suppressProps},
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
            dencity: 0.0,
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
        let { classes } = this.props;
        return (
            <div>
                <h3 className="my-3 text-center">Dose rate calculation</h3>
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
                            <Button className={classes.button} variant="raised" color="secondary" onClick={this.addRow}>
                                <PlusOne className={classes.leftIcon}/>
                                Row
                            </Button>
                            <Button className={classes.button} variant="raised" color="primary" onClick={this.nextPage}>
                                Next
                                <Forward className={classes.rightIcon}/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CalibrationTable = connect(
    state => ({
        data: getFormValues(ReduxForms.DoseRate)(state).initialData
    })
)(CalibrationTable);

export default reduxForm({
    form: ReduxForms.DoseRate, // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    initialValues: {
        initialData: initialData,
        finalData: finalData,
        radYield: 0,
        solutionDensity: 0,
        unit: Units.moleculesPerHundredVolt
    }
})(withStyles(styles)(CalibrationTable));