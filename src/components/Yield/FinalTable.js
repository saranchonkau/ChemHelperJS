import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/main-with-styles';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PlusOne from 'material-ui-icons/PlusOne';
import Forward from 'material-ui-icons/ArrowForward';
import Back from 'material-ui-icons/ArrowBack';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import Select from 'material-ui/Select';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import {Units} from "../../utils";
import NumberFormat from 'react-number-format';

const cellStyle = {
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: 'none'
};

const DensityFormat = ({ inputRef, onChange, ...other }) => {
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            suffix=" g/ml"
            allowNegative={false}
        />
    );
};

const DoseRateFormat = ({ inputRef, onChange, ...other }) => {
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            suffix=" Gy/s"
            allowNegative={false}
        />
    );
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


class FinalTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.finalData,
            solutionDensity: props.solutionDensity,
            doseRate: props.doseRate,
            unit: props.unit
        };
        this.gridOptions = {
            columnDefs: [
                { unSortIcon: true, headerName: '№', field: 'id', width: 25, cellStyle: cellStyle, suppressFilter: true },
                { unSortIcon: true,
                    headerName: 'Time, min',
                    field: 'time',
                    editable: true,
                    width: 40,
                    cellStyle: cellStyle,
                    valueParser: numberParser
                },
                { unSortIcon: true,
                    headerName: 'Optical Dencity',
                    field: 'dencity',
                    editable: true,
                    width: 50,
                    cellStyle: cellStyle,
                    valueParser: numberParser
                },
                { unSortIcon: true,
                    headerName: 'Concentration, M',
                    field: 'concentration',
                    editable: true,
                    width: 60,
                    cellStyle: cellStyle,
                    valueParser: numberParser
                },
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

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        this.gridApi.selectAll();
    };

    addRow = () => {
        let newRow = {
            id: this.state.data.length + 1,
            concentration: 0.0,
            dencity: 0.0,
            time: 0.0,
            isSelected: true
        };
        let data = [...this.getRowData(), newRow];
        console.log('data: ', data);
        this.setState({data});
        this.gridApi.setRowData(data);
    };

    getRowData = () => {
        let array = [];
        this.gridApi.forEachNode(node => array.push({...node.data, isSelected: node.selected}));
        return array;
    };

    selectData = () => {
        this.gridApi.forEachNode(node => {
            if (node.data.isSelected) {
                node.setSelected(true);
            }
        });
    };

    calculateConcentrations = () => {
        let func = this.props.trendFunc;
        let data = this.getRowData();
        data = data.map(point => {
            point.concentration = func(point.dencity);
            return point;
        });
        this.gridApi.setRowData(data);
        this.selectData();
    };

    getTableHeight = dataLength => 45 + dataLength * 26;

    nextPage = () => {
        let {unit, doseRate, solutionDensity} = this.state;
        this.props.change('finalData', this.getRowData());
        this.props.change('unit', unit);
        this.props.change('doseRate', doseRate);
        this.props.change('solutionDensity', solutionDensity);
        this.props.nextPage();
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        let containerStyle = {
            height: this.getTableHeight(this.state.data.length),
            width: 600,
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
                            <Button className={classes.button} raised color="secondary" onClick={this.calculateConcentrations}>
                                Calculate concentrations
                            </Button>
                            <Button className={classes.button} raised color="secondary" onClick={this.addRow}>
                                <PlusOne className={classes.leftIcon} />
                                Row
                            </Button>
                            <Button className={classes.button} raised color="secondary" onClick={this.props.previousPage}>
                                <Back className={classes.leftIcon} />
                                Back
                            </Button>
                            <Button className={classes.button} raised color="primary" onClick={this.nextPage}>
                                Next
                                <Forward className={classes.rightIcon} />
                            </Button>
                        </div>
                        <div>
                            <h3 className="my-3 text-center">Enter parameters for calculating yield:</h3>
                            <div className='d-table'>
                                <div className='d-table-row'>
                                    <div className='d-table-cell' style={{width: 160}}>Solution dencity &rho; :</div>
                                    <div className='d-table-cell'>
                                        <Input value={this.state.solutionDensity}
                                               onChange={this.handleChange('solutionDensity')}
                                               inputComponent={DensityFormat}
                                        />
                                    </div>
                                </div>
                                <div className='d-table-row'>
                                    <div className='d-table-cell' style={{width: 160}}>Dose rate P :</div>
                                    <div className='d-table-cell'>
                                        <Input value={this.state.doseRate}
                                               onChange={this.handleChange('doseRate')}
                                               inputComponent={DoseRateFormat}
                                        />
                                    </div>
                                </div>
                                <div className='d-table-row'>
                                    <div className='d-table-cell'>Unit of measure of yield:</div>
                                    <div className='d-table-cell'>
                                        <Select value={this.state.unit} onChange={this.handleChange('unit')}>
                                            <MenuItem value={Units.moleculesPerHundredVolt}>{Units.moleculesPerHundredVolt}</MenuItem>
                                            <MenuItem value={Units.molPerJoule}>{Units.molPerJoule}</MenuItem>
                                        </Select>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

FinalTable = connect(
    state => ({
        trendFunc: getFormValues('Wizard')(state).trendFunc,
        finalData: getFormValues('Wizard')(state).finalData,
        doseRate: getFormValues('Wizard')(state).doseRate,
        solutionDensity: getFormValues('Wizard')(state).solutionDensity,
        unit: getFormValues('Wizard')(state).unit
    })
)(FinalTable);

export default reduxForm({
    form: 'Wizard', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withStyles(styles)(FinalTable));
