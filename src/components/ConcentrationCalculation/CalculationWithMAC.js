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
import {calculateRowId, ExcelPatternTypes, maxFromArray, numberParser, PageNumbers} from "../../utils/utils";
import ControlledNumberInput from "../Others/ControlledInput";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';
import MaterialButton from '../Others/MaterialButton';
import numeral from 'numeral';
import SavePatternButton from "../Others/SavePatternButton";
import CopyButton from "../Others/CopyButton";
import {createOpticalDensityTableTSVFile} from "../../utils/excel/opticalDensityTable";

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
                    { headerName: 'Concentration', field: 'concentration', width: 175, editable: true, cellStyle: cellStyle,
                        valueParser: numberParser, unSortIcon: true, ...suppressProps,
                        valueFormatter: params => {
                            if (Number.isNaN(params.value)) {
                                return params.value;
                            } else {
                                return numeral(params.value).format('0.0000000e+0');
                            }
                        }
                    },
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
            this.gridApi && this.gridApi.forEachNode(node => array.push({...node.data}));
            return array;
        };

        onGridReady = params => {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        };

        addRow = () => {
            const rowData = this.getRowData();
            const newRow = {
                id: calculateRowId(rowData.map(data => data.id)),
                density: 0.0,
                isSelected: true
            };
            this.setState({data: [...rowData, newRow]});
        };

        getTableHeight = dataLength => 64 + dataLength * 30.5;

        modifyFinalData = () => {
            return this.state.data.map(point => {
                const foundPoint = this.props.finalData.find(finalPoint => finalPoint.id === point.id);
                return {
                    id: point.id,
                    time: foundPoint ? foundPoint.time : 0.0,
                    concentration: point.density / (this.state.pathLength * this.state.MAC),
                    density: point.density,
                    isSelected: true
                };
            });
        };

        calculateConcentrations = () => {
            const data = this.getRowData();
            data.forEach(point => { point.concentration = point.density / (this.state.pathLength * this.state.MAC); });
            this.setState({data: data});
        };

        getOpticalDensityData = () => {
            const data = this.getRowData();
            data.forEach(point => { point.concentration = point.density / (this.state.pathLength * this.state.MAC); });
            return data;
        };

        getExportData = () => ({
            opticalDensityData: this.getOpticalDensityData(),
            pathLength: this.state.pathLength,
            MAC: this.state.MAC
        });

        nextPage = () => {
            this.props.change('finalData', this.modifyFinalData());
            this.props.change('opticalDensityData', this.getOpticalDensityData());
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
            const { pathLength, pathLengthError, MAC, MACError, data } = this.state;
            return (
                <React.Fragment>
                    <h3 className="my-3 text-center">{title}</h3>
                    <h5 className="text-center">Calculation with molar extinction coefficient</h5>
                    <div className='d-flex justify-content-center'>
                        <div style={{width: 600}}>
                            <div className="ag-theme-blue" style={{height: this.getTableHeight(this.state.data.length)}}>
                                <AgGridReact
                                    rowData={this.state.data}
                                    onGridReady={this.onGridReady}
                                    gridOptions={this.gridOptions}
                                />
                            </div>
                            <div className='d-flex flex-row justify-content-between'>
                                <BackButton onClick={this.previousPage}/>
                                <MaterialButton text={'Calculate concentrations'}
                                                onClick={this.calculateConcentrations}
                                                disabled={!this.isCorrectData() || data.length === 0}
                                />
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
                            <div className='d-flex justify-content-end'>
                                <CopyButton text={createOpticalDensityTableTSVFile({data: this.getExportData()})}
                                            disabled={!this.isCorrectData()}
                                />
                                <SavePatternButton patternType={ExcelPatternTypes.OPTICAL_DENSITY_TABLE}/>
                            </div>
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
            finalData: getFormValues(form)(state).finalData
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
