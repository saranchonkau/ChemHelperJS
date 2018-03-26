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
import {numberParser, PageNumbers} from "../../utils/utils";
import ControlledNumberInput from "../Others/ControlledInput";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';

export const styles = theme => ({});

const CalculationWithMACWrapper = ({form, ...rest}) => {
    class CalculationWithMAC extends Component {

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
                concentration: point.density / (this.state.pathLength * this.state.MAC),
                density: point.density,
                isSelected: true
            }));
        };

        nextPage = () => {
            this.props.change('finalData', this.modifyFinalData());
            this.props.change('opticalDensityData', this.getRowData());
            this.props.change('pathLength', this.state.pathLength);
            this.props.change('MAC', this.state.MAC);
            this.props.goToPage(PageNumbers.FINAL_TABLE);
        };

        previousPage = () => {
            this.props.change('pathLength', 0);
            this.props.change('MAC', 0);
            this.props.previousPage();
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
            const { pathLength, pathLengthError, MAC, MACError } = this.state;
            return ( pathLength && MAC ) && ( !pathLengthError && !MACError );
        };

        render() {
            const { classes, title } = this.props;
            const { pathLength, pathLengthError, MAC, MACError } = this.state;
            return (
                <React.Fragment>
                    <h3 className="my-3 text-center">{title}</h3>
                    <h5 className="text-center">Calculation with molar attenuation coefficient</h5>
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
                                <BackButton onClick={this.previousPage}/>
                                <AddRowButton onClick={this.addRow}/>
                                <NextButton onClick={this.nextPage} disabled={!this.isCorrectData()}/>
                            </div>
                            <h5 className="my-3 text-center">Enter parameters for calculating concentrations:</h5>
                            <table>
                                <tbody>
                                <tr>
                                    <td>Path length (cm):</td>
                                    <td>
                                        <ControlledNumberInput id={'pathLength-input'}
                                                               value={pathLength}
                                                               onChange={this.handleNumberChange('pathLength')}
                                                               error={pathLengthError}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width: 200}}>Molar attenuation coefficient &#949; (l/(mol&middot;cm)):</td>
                                    <td>
                                        <ControlledNumberInput id={'MAC-input'}
                                                               value={MAC}
                                                               onChange={this.handleNumberChange('MAC')}
                                                               error={MACError}
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

    CalculationWithMAC = connect(
        state => ({
            data: getFormValues(form)(state).opticalDensityData,
            pathLength: getFormValues(form)(state).pathLength,
            MAC: getFormValues(form)(state).MAC,
        })
    )(CalculationWithMAC);

    CalculationWithMAC = reduxForm({
        form: form,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    })(withStyles(styles)(CalculationWithMAC));

    return <CalculationWithMAC {...rest}/>;
};

export default CalculationWithMACWrapper;
