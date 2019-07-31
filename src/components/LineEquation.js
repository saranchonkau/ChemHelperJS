import React from 'react';
import PropTypes from 'prop-types';

import { expFormat, expFormatWithSign } from 'utils/utils';

import Equation from './Equation';

function LineEquation({ slope, intercept }) {
  // prettier-ignore
  const equation = `y=${expFormat(slope)}\\cdot{x}${expFormatWithSign(intercept)}`;

  return <Equation equation={equation} />;
}

LineEquation.propTypes = {
  slope: PropTypes.number,
  intercept: PropTypes.number,
};

export default LineEquation;
