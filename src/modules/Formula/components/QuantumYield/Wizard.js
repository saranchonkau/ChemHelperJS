import React from 'react';

import { finalData, initialData, initialOpticalDensityData } from 'utils/Data';
import { ConcentrationCalculationWays } from 'utils/utils';

import { Wizard } from 'components/Wizard';

import CalculationWaySelection from '../ConcentrationCalculation/CalculationWaySelection';
import CalibrationTable from '../ConcentrationCalculation/CalibrationTable';
import CalibrationChart from '../ConcentrationCalculation/CalibrationChart';
import OpticalDensityTable from '../ConcentrationCalculation/OpticalDensityTable';
import CalculationWithMAC from '../ConcentrationCalculation/CalculationWithMAC';

import FinalTable from './FinalTable';
import FinalChart from './FinalChart';

const initialValues = {
  initialData: initialData,
  calculationWay: ConcentrationCalculationWays.OWN_WAY,

  opticalDensityData: initialOpticalDensityData,
  pathLength: 0,
  MAC: 0,

  finalData: finalData,
  lightIntensity: '',
  volume: '',
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

function QuantumYieldWizard() {
  return (
    <Wizard
      initialValues={initialValues}
      components={components}
      title="Quantum yield"
    />
  );
}

export default QuantumYieldWizard;
