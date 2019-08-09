import React from 'react';

import { finalData, initialData, initialOpticalDensityData } from 'utils/Data';

import { Wizard } from 'components/Wizard';

import CalculationWaySelection from '../ConcentrationCalculation/CalculationWaySelection';
import CalibrationTable from '../ConcentrationCalculation/CalibrationTable';
import CalibrationChart from '../ConcentrationCalculation/CalibrationChart';
import OpticalDensityTable from '../ConcentrationCalculation/OpticalDensityTable';
import CalculationWithMAC from '../ConcentrationCalculation/CalculationWithMAC';

import FinalTable from './FinalTable';
import FinalChart from './FinalChart';
import {
  ConcentrationCalculationWays,
  Units,
} from '../../../../constants/common';

const initialValues = {
  initialData: initialData,
  calculationWay: ConcentrationCalculationWays.OWN_WAY,

  opticalDensityData: initialOpticalDensityData,
  pathLength: 0,
  MAC: 0,

  finalData: finalData,
  radYield: '',
  solutionDensity: '',
  unit: Units.moleculesPerHundredVolt,
};

const components = [
  CalculationWaySelection,
  CalculationWithMAC,
  CalibrationTable,
  CalibrationChart,
  OpticalDensityTable,
  FinalTable,
  FinalChart,
];

function DoseRateWizardWizard() {
  return (
    <Wizard
      initialValues={initialValues}
      components={components}
      title="Dose rate"
    />
  );
}

export default DoseRateWizardWizard;
