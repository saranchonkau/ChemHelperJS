import React from 'react';
import CalibrationTable from './CalibrationTable';
import CalibrationChart from './CalibrationChart';
import FinalTable from './FinalTable';
import FinalChart from './FinalChart';
import PagesManager from '../Others/PagesManager';
import {ReduxForms, Units} from "../../utils/utils";
import {finalData, initialData} from "../../utils/Data";
import {reduxForm} from "redux-form";

const Wizard = PagesManager({pages: [
        CalibrationTable,
        CalibrationChart,
        FinalTable,
        FinalChart
    ]});

export default reduxForm({
    form: ReduxForms.Yield, // <------ same form name
    destroyOnUnmount: true, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    initialValues: {
        initialData: initialData,
        finalData: finalData,
        doseRate: 0,
        solutionDensity: 0,
        unit: Units.moleculesPerHundredVolt
    }
})(Wizard);