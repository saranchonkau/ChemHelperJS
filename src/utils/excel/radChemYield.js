import { replaceAll } from '../utils';

const TAB = '\t';
const CRLF = '\r\n';

export const createYieldTSVFile = ({ data }) => {
  const rows = [
    createRow([]),
    createFirstRow({ unit: data.unit }),
    createSecondRow({ data }),
    createThirdRow({ data }),
    createForthRow({ data }),
    createFifthRow({ data }),
    createSixthRow({ data }),
    ...createRestRows({ data }),
  ];
  return replaceAll(rows.join(''), '.', ',');
};

const createFirstRow = ({ unit }) => {
  const array = [
    '',
    'Absorbed dose, Gray',
    'Concentration, M',
    '',
    `Yield, ${unit}`,
    'Yield confidence interval',
  ];
  return createRow(array);
};

const createSecondRow = ({ data }) => {
  const pointIsExist = data.finalData.length > 0;
  const array = [
    '',
    pointIsExist ? data.finalData[0].dose : '',
    pointIsExist ? data.finalData[0].concentration : '',
    '',
    data.yield,
    data.confidenceInterval,
  ];
  return createRow(array);
};

const createThirdRow = ({ data: { finalData } }) => {
  const pointIsExist = finalData.length > 1;
  const array = [
    '',
    pointIsExist ? finalData[1].dose : '',
    pointIsExist ? finalData[1].concentration : '',
    '',
    'Dose rate P (Gy/s)',
  ];
  return createRow(array);
};

const createForthRow = ({ data: { finalData, doseRate } }) => {
  const pointIsExist = finalData.length > 2;
  const array = [
    '',
    pointIsExist ? finalData[2].dose : '',
    pointIsExist ? finalData[2].concentration : '',
    '',
    doseRate,
  ];
  return createRow(array);
};

const createFifthRow = ({ data: { finalData } }) => {
  const pointIsExist = finalData.length > 3;
  const array = [
    '',
    pointIsExist ? finalData[3].dose : '',
    pointIsExist ? finalData[3].concentration : '',
    '',
    'Solution density (g/ml)',
  ];
  return createRow(array);
};

const createSixthRow = ({ data: { finalData, solutionDensity } }) => {
  const pointIsExist = finalData.length > 4;
  const array = [
    '',
    pointIsExist ? finalData[4].dose : '',
    pointIsExist ? finalData[4].concentration : '',
    '',
    solutionDensity,
  ];
  return createRow(array);
};

const createRestRows = ({ data: { finalData } }) => {
  const result = finalData.slice(5).map(point => {
    return createRow(['', point.dose, point.concentration]);
  });
  // TODO replace with result.fill(value, startPosition, endPosition)
  while (result.length < 10) {
    result.push(createRow(['', '', '']));
  }
  return result;
};

const createRow = array => array.join(TAB).concat(CRLF);
