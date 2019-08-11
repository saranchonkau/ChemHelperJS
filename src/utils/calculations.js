import { Units } from 'constants/common';
import { calculateStudentCoefficient } from './statiscticsDistributions';

export function calculateDoseRate({ slope, density, radYield, unit }) {
  const coefficient = 6.02214e6 * 1.602176;
  const yieldPerJoule = slope / (density * radYield);
  return unit === Units.moleculesPerHundredVolt
    ? yieldPerJoule * coefficient
    : yieldPerJoule;
}

export function calculateQuantumYield({ slope, volume, lightIntensity }) {
  return (6.02214e23 * volume * slope) / (1000 * lightIntensity);
}

export function calculateYield({ slope, density, unit }) {
  let coefficient = 6.02214e6 * 1.602176;
  let yieldPerJoule = slope / density;
  return unit === Units.moleculesPerHundredVolt
    ? yieldPerJoule * coefficient
    : yieldPerJoule;
}

export const getTrendResult = (data, includeIntercept = true) => {
  return includeIntercept
    ? getTrendWithIntercept(data)
    : getTrendWithoutIntercept(data);
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
    sums: {},
  };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;
  let N = data.length;

  data.forEach(({ x, y }) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  });

  result.slope = (N * sumXY - sumX * sumY) / (N * sumXX - sumX * sumX);
  result.intercept = (sumY - result.slope * sumX) / N;

  let varSum = 0;
  data.forEach(
    ({ x, y }) =>
      (varSum += Math.pow(y - result.slope * x - result.intercept, 2)),
  );

  const delta = N * sumXX - sumX * sumX;

  if (N > 2) {
    const vari = (1.0 / (N - 2.0)) * varSum;
    result.interceptError = Math.sqrt((vari / delta) * sumXX);
    result.slopeError = Math.sqrt((N / delta) * vari);
    result.studentCoefficient = Math.abs(
      calculateStudentCoefficient(N - 2, 0.025),
    );
    result.slopeConfidenceInterval =
      result.slopeError * result.studentCoefficient;
    result.interceptConfidenceInterval =
      result.interceptError * result.studentCoefficient;
  }

  result.rSquared = Math.pow(
    (N * sumXY - sumX * sumY) /
      Math.sqrt((N * sumXX - sumX * sumX) * (N * sumYY - sumY * sumY)),
    2,
  );
  result.predictY = x => result.slope * x + result.intercept;
  result.predictX = y => (y - result.intercept) / result.slope;

  // result.sums = { sumX, sumY, sumXY, sumXX, sumYY, N, delta, vari };
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
    sums: {},
  };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;
  let N = data.length;

  data.forEach(({ x, y }) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  });

  result.slope = sumXY / sumXX;

  let varSum = 0;
  data.forEach(
    ({ x, y }) =>
      (varSum += Math.pow(y - result.intercept - result.slope * x, 2)),
  );

  const delta = N * sumXX - sumX * sumX;
  const vari = (1.0 / (N - 2.0)) * varSum;

  result.slopeError = Math.sqrt((N / delta) * vari);
  result.rSquared = Math.pow(
    (N * sumXY - sumX * sumY) /
      Math.sqrt((N * sumXX - sumX * sumX) * (N * sumYY - sumY * sumY)),
    2,
  );
  result.predictY = x => result.slope * x;
  result.predictX = y => y / result.slope;
  return result;
};
