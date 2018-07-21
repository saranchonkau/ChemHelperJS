import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import {calculateRowId} from "../../utils/utils";
import NextButton from '../Others/NextButton';
import BackButton from '../Others/BackButton';
import AddRowButton from '../Others/AddRowButton';
import Grid from "../Grid/Grid";
import {calibrationTableColumnDefs} from "../../constants/index";

const styles = theme => ({});

const CalibrationTableWrapper = ({form, ...rest}) => {
    class CalibrationTable extends Component {

        constructor(props) {
            super(props);
            this.state = {
                data: props.data
            };
        }

        onGridReady = api => {
            this.api = api;
        };

        addRow = () => {
            const rowData = this.api.getRowData();
            const newRow = {
                id: calculateRowId(rowData.map(data => data.id)),
                concentration: 0.0,
                density: 0.0,
                isSelected: true
            };
            this.api.createRow(newRow);
        };

        nextPage = () => {
            this.props.change('initialData', this.api.getRowData());
            this.props.nextPage();
        };

        render() {
            let { classes, previousPage, title } = this.props;
            return (
                <React.Fragment>
                    <h3 className="my-3 text-center">{title}</h3>
                    <h5 className="text-center">Calibration table</h5>
                    <div className='d-flex justify-content-center'>
                        <div style={{width: 525}}>
                            <Grid data={this.state.data}
                                  options={{ columnDefs: calibrationTableColumnDefs }}
                                  onGridReady={this.onGridReady}
                            />
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
        form: form,
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
    })(withStyles(styles)(CalibrationTable));

    return <CalibrationTable {...rest}/>
};

export default CalibrationTableWrapper;