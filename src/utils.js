import React from 'react';
import numeral from 'numeral';
import {Tex} from 'react-tex';
import PropTypes from 'prop-types';

export const Units = {
    moleculesPerHundredVolt: 'molecules/100eV',
    molPerJoule: 'mol/J'
};



export const getTrendResult = data => {
    const result = {
        slope: 0,
        intercept: 0,
        slopeError: 0,
        interceptError: 0,
        rSquared: 0,
        predictY: null,
        predictX: null
    };

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;
    let N = data.length;

    data.forEach(({x, y}) => {
        sumX += x;
        sumY += y;
        sumXY += x*y;
        sumXX += x*x;
        sumYY += y*y;
    });

    result.slope = ((N * sumXY - sumX * sumY) ) / (N * sumXX - sumX * sumX);
    result.intercept = (sumY - result.slope * sumX) / N;

    let varSum = 0;
    data.forEach(({x, y}) =>
        varSum += (y - result.intercept - result.slope * x) * (y - result.intercept - result.slope * x)
    );

    const delta = N * sumXX - sumX*sumX;
    const vari = 1.0 / (N - 2.0) * varSum;

    result.interceptError = Math.sqrt(vari / delta * sumXX);
    result.slopeError = Math.sqrt(N / delta * vari);
    result.rSquared = Math.pow((N * sumXY - sumX * sumY)/Math.sqrt((N * sumXX - sumX * sumX)*(N * sumYY - sumY * sumY)),2);
    result.predictY = x => result.slope * x + result.intercept;
    result.predictX = y => (y - result.intercept) / result.slope;
    return result;
};

export const getNumberWithSign = num => {
    if (num > 0) {
        return `+${num}`;
    } else if (num < 0) {
        return num;
    } else {
        return '';
    }
};

const expFormat = num => {
    let formatted = numeral(num).format('0.00000e+0');
    let parts = formatted.split('e');
    let power = parseInt(parts[1], 10);
    return power === 0 ? parts[0] : `${parts[0]}\\cdot{10^{${power}}}`;
};

const expFormatWithSign = num => {
    let formatted = numeral(num).format('+0.00000e+0');
    let parts = formatted.split('e');
    let power = parseInt(parts[1], 10);
    return power === 0 ? parts[0] : `${parts[0]}\\cdot{10^{${power}}}`;
};

const getSign = num => {
    if (num > 0) {
        return '+';
    } else if (num < 0) {
        return '-';
    } else {
        return '';
    }
};

const Equation = ({slope, intercept}) => (
    <Tex texContent={`y=${expFormat(slope)}\\cdot{x}${expFormatWithSign(intercept)}`}/>
);

Equation.propTypes = {
    slope: PropTypes.number,
    intercept: PropTypes.number
};

const RSquared = ({rSquared}) => (
    <Tex texContent={`R^2=${numeral(rSquared).format('0.00000')}`}/>
);

RSquared.propTypes = {
    rSquared: PropTypes.number
};

const Result = ({name, value, error, unit}) => (
    <Tex texContent={`
        ${name}=${expFormat(value)}
        ${error ? `\\pm${expFormat(Math.abs(error))}` : ''}
        ${unit ? `\\enspace{${unit}}` : ''}
    `}/>
);

Result.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    error: PropTypes.number,
    unit: PropTypes.string
};

export {Equation, RSquared, Result};