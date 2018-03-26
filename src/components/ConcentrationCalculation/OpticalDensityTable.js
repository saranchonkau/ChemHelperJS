import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import { withStyles } from 'material-ui/styles';
import {reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {getInitialData} from "../../utils/Data";
import RemoveRowRenderer from '../../utils/cellRenderers/RemoveRowRenderer';
import {cellStyle, suppressProps} from "../App/StyleConstants";
import {cloneDeep} from "lodash";
import {numberParser} from "../../utils/utils";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';

export const styles = theme => ({});

const OpticalDensityTableWrapper = ({form, ...rest}) => {
    class OpticalDensityTable extends Component {

        constructor(props) {
            super(props);
            this.state = {
                data: cloneDeep(props.data),
                pathLength: props.pathLength,
                pathLengthError: '',
                MAC: props.MAC,
                MACError: ''
            };
            this.gridOptions = {
                columnDefs: [
                    { headerName: '№', field: 'id', width: 70, cellStyle: cellStyle, ...suppressProps, unSortIcon: true },
                    { headerName: 'Optical Density', field: 'density', width: 175, editable: true, cellStyle: cellStyle, valueParser: numberParser, unSortIcon: true, ...suppressProps},
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
                onRowDataUpdated: (params) => this.setState({data: this.getRowData()}),
                headerHeight: 50,
                rowHeight: 30
            };
        }

        getRowData = () => {
            let array = [];
            this.gridApi.forEachNode(node => array.push({...node.data}));
            return array;
        };

        onGridReady = params => {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        };

        addRow = () => {
            const rowData = this.getRowData();
            const newRow = {
                id: Math.max.apply(null, rowData.map(data => data.id)) + 1,
                density: 0.0,
                isSelected: true
            };
            this.setState({data: [...rowData, newRow]});
        };

        getTableHeight = dataLength => 64 + dataLength * 30.5;

        modifyFinalData = () => {
           return this.state.data.map(point => ({
               id: point.id,
               time: 0.0,
               concentration: this.props.trendFunc(point.density),
               density: point.density,
               isSelected: true
           }));
        };

        nextPage = () => {
            this.props.change('finalData', this.modifyFinalData());
            this.props.change('opticalDensityData', this.getRowData());
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

        render() {
            const { classes, title, previousPage } = this.props;
            return (
                <React.Fragment>
                    <h3 className="my-3 text-center">{title}</h3>
                    <h5 className="text-center">Optical density table</h5>
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

    OpticalDensityTable = connect(
        state => ({
            data: getFormValues(form)(state).opticalDensityData,
            trendFunc: getFormValues(form)(state).trendFunc,
        })
    )(OpticalDensityTable);

    OpticalDensityTable = reduxForm({
        form: form,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    })(withStyles(styles)(OpticalDensityTable));

    return <OpticalDensityTable {...rest}/>;
};

export default OpticalDensityTableWrapper;