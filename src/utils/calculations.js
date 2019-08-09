import { Units } from '../constants/common';

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
