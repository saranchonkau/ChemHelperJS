import React from 'react';
import PropTypes from 'prop-types';

import { expFormat } from 'utils/utils';

import Equation from './Equation';

function CalculationResult({ name, value, error, unit }) {
  const equation = `
        ${name}=${expFormat(value)}
        ${error ? `\\pm${expFormat(Math.abs(error))}` : ''}
        ${unit ? `\\enspace{${unit}}` : ''}
    `;

  return <Equation equation={equation} />;
}

CalculationResult.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  error: PropTypes.number,
  unit: PropTypes.string,
};

export default CalculationResult;
