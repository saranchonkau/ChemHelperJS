import React from 'react';
import FinalTable from './FinalTable';
import FinalChart from './FinalChart';
import PagesManager from '../Others/PagesManager';
import {ReduxForms} from "../../utils/utils";
import {finalData, initialData, initialOpticalDensityData} from "../../utils/Data";
import {reduxForm} from "redux-form";
import CalculationWaySelection from '../ConcentrationCalculation/CalculationWaySelection';
import CalibrationTable from '../ConcentrationCalculation/CalibrationTable';
import CalibrationChart from '../ConcentrationCalculation/CalibrationChart';
import OpticalDensityTable from '../ConcentrationCalculation/OpticalDensityTable';
import CalculationWithMAC from '../ConcentrationCalculation/CalculationWithMAC';

const pageTitle = 'Quantum yield';
const pageProps = { title: pageTitle, form: ReduxForms.QuantumYield };

const Wizard = PagesManager({ pages: [
    { component: CalculationWaySelection, props: { ...pageProps }},
    { component: CalculationWithMAC, props: { ...pageProps }},
    { component: CalibrationTable, props: { ...pageProps }},
    { component: CalibrationChart, props: { ...pageProps }},
    { component: OpticalDensityTable, props: { ...pageProps }},
    { component: FinalTable },
    { component: FinalChart }
]});

export default reduxForm({
    form: ReduxForms.QuantumYield,
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true,
    initialValues: {

        initialData: initialData,

        opticalDensityData: initialOpticalDensityData,
        pathLength: 0,
        MAC: 0,

        finalData: finalData,
        lightIntensity: '',
        volume: ''
    }
})(Wizard);