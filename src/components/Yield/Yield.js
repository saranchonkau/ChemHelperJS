import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/main-with-styles';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PlusOne from 'material-ui-icons/PlusOne';
import Forward from 'material-ui-icons/ArrowForward';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';

const cellStyle = {
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: 'none'
};

const initialData = [
    {
        id: 1,
        concentration: 5e-5,
        dencity: 0.015
    },
    {
        id: 2,
        concentration: 8e-5,
        dencity: 0.025
    },
    {
        id: 3,
        concentration: 1e-4,
        dencity: 0.03
    },
    {
        id: 4,
        concentration: 4e-4,
        dencity: 0.122
    }
];

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

class Yield extends Component {
    constructor(props) {
        super(props);
        console.log('Props: ', props);
        this.state = {
            data: props.initialValues.initialData
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
                { unSortIcon: true, headerName: 'Optical Dencity', field: 'dencity', editable: true, width: 60, cellStyle: cellStyle },
                { checkboxSelection: true, width: 30, headerName: 'On/Off', cellStyle: cellStyle}
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
            rowSelection: 'multiple'
        };

    }

    componentDidUpdate(){
        console.log('Component Did update');
        if (this.gridApi) {
            this.gridApi.selectAll();
        }
    }

    onGridReady = params => {
        console.log('Grid ready');
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        this.gridApi.sizeColumnsToFit();
        this.gridApi.selectAll();
    };

    addRow = () => {
        let newRow = {
            id: this.state.data.length + 1,
            concentration: 0,
            dencity: 0
        };
        this.setState({data: this.state.data.concat(newRow)});
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
            width: 500,
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
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button className={classes.button} raised color="secondary" onClick={this.addRow}>
                                <PlusOne className={classes.leftIcon} />
                                Row
                            </Button>
                            <Button className={classes.button} raised color="primary" onClick={this.nextPage}>
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
        initialData: initialData
    }
})(withStyles(styles)(Yield));



