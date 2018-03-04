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
import Input from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import {ReduxForms, Units} from "../../utils/utils";
import NumberFormat from 'react-number-format';
import numeral from 'numeral';
import RemoveRowRenderer from '../../utils/cellRenderers/RemoveRowRenderer';
import {cellStyle, suppressProps} from "../App/StyleConstants";
import CheckBoxRenderer from "../../utils/cellRenderers/CheckBoxRenderer";
import {cloneDeep} from "lodash";

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

const RadYieldFormat = ({ inputRef, onChange, unit, ...other }) => {
    return (
        <NumberFormat
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            suffix={` ${unit}`}
            thousandSeparator
            allowNegative={false}
            {...other}
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
            data: cloneDeep(props.finalData),
            solutionDensity: props.solutionDensity,
            radYield: props.radYield,
            unit: props.unit
        };
        this.gridOptions = {
            columnDefs: [
                { headerName: '№', field: 'id', width: 70, cellStyle: cellStyle, ...suppressProps, unSortIcon: true },
                { headerName: 'Time, min', field: 'time', width: 130, editable: true, cellStyle: cellStyle, valueParser: numberParser, ...suppressProps, unSortIcon: true},
                { headerName: 'Optical Density', field: 'dencity', width: 175, editable: true, cellStyle: cellStyle, valueParser: numberParser, unSortIcon: true, ...suppressProps},
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
            id: Math.max.apply(null, rowData.map(data => data.id)) + 1,
            concentration: 0.0,
            dencity: 0.0,
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

    calculateConcentrations = () => {
        const { trendFunc } = this.props;
        let data = this.getRowData();
        data.forEach(point => { point.concentration = trendFunc(point.dencity); });
        this.setState({data: data});
    };

    getTableHeight = dataLength => 64 + dataLength * 30.5;

    nextPage = () => {
        let {unit, radYield, solutionDensity} = this.state;
        this.props.change('finalData', this.getRowData());
        this.props.change('unit', unit);
        this.props.change('radYield', radYield);
        this.props.change('solutionDensity', solutionDensity);
        this.props.nextPage();
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        let { classes } = this.props;
        return (
            <div>
                <h3 className="my-3 text-center">Dose rate calculation</h3>
                <h5 className="text-center">Final table</h5>
                <div className='d-flex flex-row justify-content-center'>
                    <div style={{width: 670}}>
                        <div className="ag-theme-blue" style={{height: this.getTableHeight(this.state.data.length)}}>
                            <AgGridReact
                                rowData={this.state.data}
                                onGridReady={this.onGridReady}
                                gridOptions={this.gridOptions}
                            />
                        </div>
                        <div className='d-flex flex-row justify-content-between'>
                            <Button className={classes.button} variant="raised" color="secondary"
                                    onClick={this.calculateConcentrations}
                            >
                                Calculate concentrations
                            </Button>
                            <Button className={classes.button} variant="raised" color="secondary"
                                    onClick={this.addRow}
                            >
                                <PlusOne className={classes.leftIcon}/>
                                Row
                            </Button>
                            <Button className={classes.button} variant="raised" color="secondary"
                                    onClick={this.props.previousPage}
                            >
                                <Back className={classes.leftIcon}/>
                                Back
                            </Button>
                            <Button className={classes.button} variant="raised" color="primary"
                                    onClick={this.nextPage}
                                    disabled={!this.state.radYield || !this.state.solutionDensity}
                            >
                                Next
                                <Forward className={classes.rightIcon} />
                            </Button>
                        </div>
                        <h3 className="my-3 text-center">Enter parameters for calculating dose rate:</h3>
                        <table>
                            <tbody>
                            <tr>
                                <td>Solution dencity &rho; :</td>
                                <td>
                                    <Input value={this.state.solutionDensity}
                                           onChange={this.handleChange('solutionDensity')}
                                           inputComponent={DensityFormat}/>
                                </td>
                            </tr>
                            <tr>
                                <td>Yield G :</td>
                                <td>
                                    <Input value={this.state.radYield}
                                           onChange={this.handleChange('radYield')}
                                           inputProps={{unit: this.state.unit}}
                                           inputComponent={RadYieldFormat}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{width: 180}}>Unit of measure of yield:</td>
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

FinalTable = connect(
    state => ({
        trendFunc: getFormValues(ReduxForms.DoseRate)(state).trendFunc,
        finalData: getFormValues(ReduxForms.DoseRate)(state).finalData,
        radYield: getFormValues(ReduxForms.DoseRate)(state).radYield,
        solutionDensity: getFormValues(ReduxForms.DoseRate)(state).solutionDensity,
        unit: getFormValues(ReduxForms.DoseRate)(state).unit
    })
)(FinalTable);

export default reduxForm({
    form: ReduxForms.DoseRate, // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withStyles(styles)(FinalTable));
