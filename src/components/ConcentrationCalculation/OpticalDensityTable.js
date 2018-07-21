import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {calculateRowId} from "../../utils/utils";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';
import MaterialButton from "../Others/MaterialButton";
import Grid from "../Grid/Grid";
import {opticalDensityTableColumnDefs} from "../../constants/index";

export const styles = theme => ({});

const OpticalDensityTableWrapper = ({form, ...rest}) => {
    class OpticalDensityTable extends Component {

        constructor(props) {
            super(props);
            this.state = {
                data: props.data
            }
        }

        onGridReady = api => {
            this.api = api;
        };

        addRow = () => {
            const rowData = this.api.getRowData();
            const newRow = {
                id: calculateRowId(rowData.map(data => data.id)),
                density: 0.0,
                isSelected: true
            };
            this.api.createRow(newRow);
        };

        modifyFinalData = () => {
            return this.api.getRowData().map(point => {
                const foundPoint = this.props.finalData.find(finalPoint => finalPoint.id === point.id);
                return {
                    id: point.id,
                    time: foundPoint ? foundPoint.time : 0.0,
                    concentration: this.props.trendFunc(point.density),
                    density: point.density,
                    isSelected: true
                };
            });
        };

        calculateConcentrations = () => {
            const calculatedData = this.api.getRowData().map(point => ({
                ...point,
                concentration: this.props.trendFunc(point.density)
            }));
            this.setState({data: calculatedData});
        };

        nextPage = () => {
            this.props.change('finalData', this.modifyFinalData());
            this.props.change('opticalDensityData', this.api.getRowData());
            this.props.nextPage();
        };

        render() {
            const { classes, title, previousPage } = this.props;
            return (
                <React.Fragment>
                    <h3 className="my-3 text-center">{title}</h3>
                    <h5 className="text-center">Optical density table</h5>
                    <div className='d-flex justify-content-center'>
                        <div style={{width: 600}}>
                            <Grid data={this.state.data}
                                  options={{ columnDefs: opticalDensityTableColumnDefs }}
                                  onGridReady={this.onGridReady}
                            />
                            <div className='d-flex flex-row justify-content-between'>
                                <BackButton onClick={previousPage}/>
                                <MaterialButton text={'Calculate concentrations'}
                                                onClick={this.calculateConcentrations}
                                                disabled={this.state.data.length === 0}
                                />
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
            finalData: getFormValues(form)(state).finalData
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