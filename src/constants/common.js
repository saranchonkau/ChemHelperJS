// ***** Enums *****

export const CellTypes = {
  CHECK_BOX: 'CHECK_BOX',
  REMOVE: 'REMOVE',
  DEFAULT: 'DEFAULT',
};

export const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
  NONE: 'NONE',
};

// ***** Regular expressions *****

export const dotRegexp = /[,/\u0431\u044E]/;
export const finalNumberRegexp = /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d{1,2})?$/;
export const intermediateNumberRegexp = /^[\+\-]?(?:\d*(?:\.?(?:\d+(?:(?:(?:[Ee]\+)|(?:[Ee]\-)|(?:[Ee]))?(?:\d{1,2})?)?)?)?)?$/;

// ***** Helper functions *****

export const numberParser = (value, previousValue) => {
  const newValue = value.replace(dotRegexp, '.').replace(/[\u0435\u0443]/, 'e');
  if (intermediateNumberRegexp.test(newValue)) {
    return newValue;
  }
  return previousValue;
};

export const numberFormatter = value => {
  if (Number(value) === 0) return 0;

  if (Number.isNaN(value)) {
    return value;
  } else {
    return Number.parseFloat(value).toExponential(5);
  }
};

export const numberNormalizer = value => Number.parseFloat(value);

export const atomicMassFormatter = value => {
  let A = Number.parseFloat(value);
  if (Number.isNaN(A)) {
    return value;
  } else {
    return (A / 1000000).toString(10);
  }
};

// ***** Data *****

export const calibrationData = [
  {
    id: 1,
    concentration: 5e-5,
    density: 0.015,
    isSelected: true,
  },
  {
    id: 2,
    concentration: 8e-5,
    density: 0.025,
    isSelected: true,
  },
  {
    id: 3,
    concentration: 1e-4,
    density: 0.03,
    isSelected: true,
  },
  {
    id: 4,
    concentration: 4e-4,
    density: 0.122,
    isSelected: true,
  },
];

// ***** Column definitions *****

const editableNumberProps = {
  editable: true,
  parse: numberParser,
  normalize: numberNormalizer,
};

export const calibrationTableColumnDefs = [
  { headerName: '\u2116', field: 'id', width: 70 },
  {
    headerName: 'Concentration',
    field: 'concentration',
    width: 130,
    ...editableNumberProps,
    format: numberFormatter,
  },
  {
    headerName: 'Optical Density',
    field: 'density',
    width: 165,
    ...editableNumberProps,
  },
  {
    headerName: 'On/Off',
    field: 'isSelected',
    width: 90,
    type: CellTypes.CHECK_BOX,
  },
  { type: CellTypes.REMOVE, width: 70 },
];

export const calculationWithMACColumnDefs = [
  { headerName: '\u2116', field: 'id', width: 70 },
  {
    headerName: 'Optical Density',
    field: 'density',
    width: 175,
    ...editableNumberProps,
  },
  {
    headerName: 'Concentration',
    field: 'concentration',
    width: 175,
    ...editableNumberProps,
    format: numberFormatter,
  },
  { type: CellTypes.REMOVE, width: 70 },
];

export const opticalDensityTableColumnDefs = [
  { headerName: '\u2116', field: 'id', width: 70 },
  {
    headerName: 'Optical Density',
    field: 'density',
    width: 175,
    ...editableNumberProps,
  },
  {
    headerName: 'Concentration',
    field: 'concentration',
    width: 175,
    ...editableNumberProps,
    format: numberFormatter,
  },
  { type: CellTypes.REMOVE, width: 70 },
];

export const finalTableColumnDefs = [
  { headerName: '\u2116', field: 'id', width: 70 },
  {
    headerName: 'Time, min',
    field: 'time',
    width: 130,
    ...editableNumberProps,
  },
  {
    headerName: 'Concentration',
    field: 'concentration',
    width: 165,
    ...editableNumberProps,
    format: numberFormatter,
  },
  {
    headerName: 'On/Off',
    field: 'isSelected',
    width: 90,
    type: CellTypes.CHECK_BOX,
  },
  { type: CellTypes.REMOVE, width: 70 },
];

export const nuclidesTableColumnDefs = [
  { headerName: 'ID', field: 'nucid', width: 90 },
  { headerName: 'Z', field: 'z', width: 80, sortable: true },
  { headerName: 'N', field: 'n', width: 80, sortable: true },
  { headerName: 'Symbol', field: 'symbol', width: 130 },
  {
    headerName: 'A',
    field: 'atomic_mass',
    width: 170,
    format: atomicMassFormatter,
  },
];

export const Units = {
  moleculesPerHundredVolt: 'molecules/100eV',
  molPerJoule: 'mol/J',
};

export const ReduxForms = {
  Yield: 'Yield',
  QuantumYield: 'QuantumYield',
  DoseRate: 'DoseRate',
  ConcentrationCalculation: 'ConcentrationCalculation',
};

export const PageNumbers = {
  CONCENTRATION_CALCULATION_WAY_SELECTION: 0,
  MOLAR_ATTENUATION_COEFFICIENT_WAY: 1,
  CALIBRATION_TABLE_WAY: 2,
  CALIBRATION_CHART: 3,
  OPTICAL_DENSITY_TABLE: 4,
  FINAL_TABLE: 5,
  FINAL_CHART: 6,
};

export const ConcentrationCalculationWays = {
  OWN_WAY: PageNumbers.FINAL_TABLE.toString(10),
  MOLAR_ATTENUATION_COEFFICIENT_WAY: PageNumbers.MOLAR_ATTENUATION_COEFFICIENT_WAY.toString(
    10,
  ),
  CALIBRATION_TABLE_WAY: PageNumbers.CALIBRATION_TABLE_WAY.toString(10),
};

export const ExcelPatternTypes = {
  RAD_CHEM_YIELD: 'RAD_CHEM_YIELD',
  DOSE_RATE: 'DOSE_RATE',
  QUANTUM_YIELD: 'QUANTUM_YIELD',
  CALIBRATION_TABLE: 'CALIBRATION_TABLE',
  OPTICAL_DENSITY_TABLE: 'OPTICAL_DENSITY_TABLE',
};
