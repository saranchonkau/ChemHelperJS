import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/main-with-styles';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PlusOne from 'material-ui-icons/PlusOne';
import Forward from 'material-ui-icons/ArrowForward';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {Units} from "../../utils";
import {finalData, initialData} from "./Data";
import regression from 'regression';

const cellStyle = {
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: 'none'
};


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

export class RemoveRowRenderer extends Component {
    constructor(props){
        super(props);
    }

    removeRow = () => this.props.api.updateRowData({ remove: [this.props.data] });

    render(){
        return (
            <div className='d-flex align-items-center justify-content-center'>
                <button type="button" className='bg-transparent'
                        style={{outline: 'none', border: 'none', cursor: 'pointer'}}
                        onClick={this.removeRow}
                >
                    <span className='i fa fa-trash' style={{fontSize: 20, color: '#f50057'}}/>
                </button>
            </div>
        );
    }
}

export const optionsCellStyle = {
    paddingLeft: '0px',
    paddingRight: '0px',
    border: 'none'
};

class Yield extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
        this.gridOptions = {
            columnDefs: [
                { unSortIcon: true, headerName: '№', field: 'id', width: 25, cellStyle: cellStyle, suppressFilter: true },
                { unSortIcon: true,
                    headerName: 'Concentration',
                    field: 'concentration',
                    editable: true,
                    width: 60,
                    cellStyle: cellStyle,
                    valueParser: numberParser
                },
                { unSortIcon: true,
                    headerName: 'Optical Dencity',
                    field: 'dencity',
                    editable: true,
                    width: 60,
                    cellStyle: cellStyle,
                    valueParser: numberParser
                },
                { checkboxSelection: true, width: 30, headerName: 'On/Off', cellStyle: cellStyle},
                { width: 20, cellRendererFramework: RemoveRowRenderer, cellStyle: optionsCellStyle, cellClass: 'no-border'},

            ],
            icons: {
                sortAscending: '<i class="fa fa-sort-asc" style="color: black" />',
                sortDescending: '<i class="fa fa-sort-desc" style="color: black"/>',
                sortUnSort: '<i class="fa fa-sort" style="color: gray"/>',
            },
            enableSorting: true,
            enableColResize: true,
            singleClickEdit: true,
            stopEditingWhenGridLosesFocus: true,
            enterMovesDownAfterEdit: true,
            suppressRowClickSelection: true,
            rowSelection: 'multiple',
            onRowDataChanged: ({api}) => {
                api.forEachNode(node => {
                    if (node.data.isSelected) {
                        node.setSelected(true);
                    }
                });
            }
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

        this.gridApi.sizeColumnsToFit();
        this.gridApi.forEachNode(node => {
            if (node.data.isSelected) {
                node.setSelected(true);
            }
        });
    };

    addRow = () => {
        let newRow = {
            id: this.state.data.length + 1,
            concentration: 0.0,
            dencity: 0.0,
            isSelected: true
        };
        let data = [...this.getRowData(), newRow];
        this.setState({data});
        this.gridApi.setRowData(data);
    };

    getTableHeight = dataLength => 45 + dataLength * 26;

    nextPage = () => {
        let initialData = [];
        this.gridApi.forEachNode(node => initialData.push({...node.data, isSelected: node.selected}));
        this.props.change('initialData', initialData);
        this.props.nextPage();
    };

    render() {
        let containerStyle = {
            height: this.getTableHeight(this.state.data.length),
            width: 520,
            align: 'center'
        };

        let { classes } = this.props;
        return (
            <div>
               <h3 className="my-3 text-center">Radiation Chemistry Yield from chart</h3>
                <div className='d-flex flex-row justify-content-center'>
                    <div style={containerStyle} className="ag-theme-fresh">
                        <AgGridReact
                            rowData={this.state.data}
                            onGridReady={this.onGridReady}
                            gridOptions={this.gridOptions}
                        />
                        <div className='d-flex flex-row justify-content-between'>
                            <Button className={classes.button} variant="raised" color="secondary" onClick={this.addRow}>
                                <PlusOne className={classes.leftIcon} />
                                Row
                            </Button>
                            <Button className={classes.button} variant="raised" color="primary" onClick={this.nextPage}>
                                Next
                                <Forward className={classes.rightIcon} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Yield = connect(
    state => ({
        data: getFormValues('Wizard')(state).initialData
    })
)(Yield);

export default reduxForm({
    form: 'Wizard', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    initialValues: {
        initialData: initialData,
        finalData: finalData,
        doseRate: 0,
        solutionDensity: 0,
        unit: Units.moleculesPerHundredVolt
    }
})(withStyles(styles)(Yield));



