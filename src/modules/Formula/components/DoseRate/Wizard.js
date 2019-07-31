import React from 'react';
import FinalTable from './FinalTable';
import FinalChart from './FinalChart';
import PagesManager from 'components/PagesManager';
import { ReduxForms, Units } from 'utils/utils';
import { finalData, initialData, initialOpticalDensityData } from 'utils/Data';
import { reduxForm } from 'redux-form';
import CalculationWaySelection from '../ConcentrationCalculation/CalculationWaySelection';
import CalibrationTable from '../ConcentrationCalculation/CalibrationTable';
import CalibrationChart from '../ConcentrationCalculation/CalibrationChart';
import OpticalDensityTable from '../ConcentrationCalculation/OpticalDensityTable';
import CalculationWithMAC from '../ConcentrationCalculation/CalculationWithMAC';

const pageTitle = 'Dose rate';
const pageProps = { title: pageTitle, form: ReduxForms.DoseRate };

const Wizard = PagesManager({
  pages: [
    { component: CalculationWaySelection, props: { ...pageProps } },
    { component: CalculationWithMAC, props: { ...pageProps } },
    { component: CalibrationTable, props: { ...pageProps } },
    { component: CalibrationChart, props: { ...pageProps } },
    { component: OpticalDensityTable, props: { ...pageProps } },
    { component: FinalTable },
    { component: FinalChart },
  ],
});

export default reduxForm({
  form: ReduxForms.DoseRate,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  initialValues: {
    initialData: initialData,

    opticalDensityData: initialOpticalDensityData,
    pathLength: '',
    MAC: '',

    finalData: finalData,
    radYield: '',
    solutionDensity: '',
    unit: Units.moleculesPerHundredVolt,
  },
})(Wizard);
