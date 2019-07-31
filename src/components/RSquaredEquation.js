import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import Equation from './Equation';

function RSquaredEquation({ rSquared }) {
  const equation = `R^2=${numeral(rSquared).format('0.00000')}`;

  return <Equation equation={equation} />;
}

RSquaredEquation.propTypes = {
  rSquared: PropTypes.number,
};

export default RSquaredEquation;
