import React from 'react';
import numeral from 'numeral';
import {Tex} from 'react-tex';
import PropTypes from 'prop-types';
import {calculateStudentCoefficient} from "./statiscticsDistributions";

export const Units = {
    moleculesPerHundredVolt: 'molecules/100eV',
    molPerJoule: 'mol/J'
};

export const ReduxForms = {
    Yield: 'Yield',
    QuantumYield: 'QuantumYield',
    DoseRate: 'DoseRate',
    ConcentrationCalculation: 'ConcentrationCalculation'
};

export const PageNumbers = {
    CONCENTRATION_CALCULATION_WAY_SELECTION: 0,
    MOLAR_ATTENUATION_COEFFICIENT_WAY: 1,
    CALIBRATION_TABLE_WAY: 2,
    CALIBRATION_CHART: 3,
    OPTICAL_DENSITY_TABLE: 4,
    FINAL_TABLE: 5,
    FINAL_CHART: 6
};

export const ConcentrationCalculationWays = {
    OWN_WAY: PageNumbers.FINAL_TABLE.toString(10),
    MOLAR_ATTENUATION_COEFFICIENT_WAY: PageNumbers.MOLAR_ATTENUATION_COEFFICIENT_WAY.toString(10),
    CALIBRATION_TABLE_WAY: PageNumbers.CALIBRATION_TABLE_WAY.toString(10),
};

export const ExcelPatternTypes = {
    RAD_CHEM_YIELD: 'RAD_CHEM_YIELD',
    DOSE_RATE: 'DOSE_RATE',
    QUANTUM_YIELD: 'QUANTUM_YIELD',
    CALIBRATION_TABLE: 'CALIBRATION_TABLE',
    OPTICAL_DENSITY_TABLE: 'OPTICAL_DENSITY_TABLE'
};

window.globalTrendFunction = () => {
    return getTrendResult([
        {x: 1.47, y: 52.21},
        {x: 1.50, y: 53.12},
        {x: 1.52, y: 54.48},
        {x: 1.55, y: 55.84},
        {x: 1.57, y: 57.20},
        {x: 1.60, y: 58.57},
        {x: 1.63, y: 59.93},
        {x: 1.65, y: 61.29},
        {x: 1.68, y: 63.11},
        {x: 1.70, y: 64.47},
        {x: 1.73, y: 66.28},
        {x: 1.75, y: 68.10},
        {x: 1.78, y: 69.92},
        {x: 1.80, y: 72.19},
        {x: 1.83, y: 74.46},
    ]);
};

export const getTrendResult = (data, includeIntercept = true) => {
    return includeIntercept ?
        getTrendWithIntercept(data) :
        getTrendWithoutIntercept(data);

};

export const getTrendWithIntercept = data => {
    const result = {
        slope: 0,
        slopeError: 0,
        slopeConfidenceInterval: 0,
        intercept: 0,
        interceptError: 0,
        interceptConfidenceInterval: 0,
        studentCoefficient: 0,
        rSquared: 0,
        predictY: null,
        predictX: null,
        sums: {}
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
    data.forEach(({x, y}) => varSum += Math.pow(y - result.slope * x - result.intercept, 2));

    const delta = N * sumXX - sumX*sumX;
    const vari = 1.0 / (N - 2.0) * varSum;

    result.studentCoefficient = Math.abs(calculateStudentCoefficient(N - 2, 0.025));
    result.interceptError = Math.sqrt(vari / delta * sumXX);
    result.interceptConfidenceInterval = result.interceptError * result.studentCoefficient;
    result.slopeError = Math.sqrt(N / delta * vari);
    result.slopeConfidenceInterval = result.slopeError * result.studentCoefficient;
    result.rSquared = Math.pow((N * sumXY - sumX * sumY)/Math.sqrt((N * sumXX - sumX * sumX)*(N * sumYY - sumY * sumY)),2);
    result.predictY = x => result.slope * x + result.intercept;
    result.predictX = y => (y - result.intercept) / result.slope;

    result.sums = { sumX, sumY, sumXY, sumXX, sumYY, N, delta, vari };
    return result;
};

export const getTrendWithoutIntercept = data => {
    const result = {
        slope: 0,
        slopeError: 0,
        slopeConfidenceInterval: 0,
        studentCoefficient: 0,
        rSquared: 0,
        predictY: null,
        predictX: null,
        sums: {}
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

    result.slope = sumXY / sumXX;

    let varSum = 0;
    data.forEach(({x, y}) =>
        varSum += Math.pow((y - result.intercept - result.slope * x), 2)
    );

    const delta = N * sumXX - sumX * sumX;
    const vari = 1.0 / (N - 2.0) * varSum;

    result.slopeError = Math.sqrt(N / delta * vari);
    result.rSquared = Math.pow((N * sumXY - sumX * sumY)/Math.sqrt((N * sumXX - sumX * sumX)*(N * sumYY - sumY * sumY)),2);
    result.predictY = x => result.slope * x;
    result.predictX = y => y / result.slope;
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

export const numberParser = params => Number(params.newValue.replace(',', '.'));

export const suggestMinValue = array => {
    const min = minFromArray(array);
    const max = maxFromArray(array);
    const offset = (max - min) * 0.05;
    if ((min > 0 && min - offset < 0) || min === 0) {
        return 0;
    } else {
        return min - offset;
    }
};

export const suggestMaxValue = array => {
    const min = minFromArray(array);
    const max = maxFromArray(array);
    const offset = (max - min) * 0.05;
    if ((max < 0 && max + offset > 0) || max === 0) {
        return 0;
    } else {
        return max + offset;
    }
};

export const minFromArray = array => Math.min.apply(Math, array);

export const maxFromArray = array => Math.max.apply(Math, array);

export const calculateRowId = idArray => {
    if (idArray.length > 0) {
        return maxFromArray(idArray) + 1;
    } else {
        return 1;
    }
};

export const replaceAll = (string, omit, place, prevstring) => {
    if (prevstring && string === prevstring)
        return string;
    prevstring = string.replace(omit, place);
    return replaceAll(prevstring, omit, place, string)
};

export {Equation, RSquared, Result};