import { replaceAll } from '../common';

const TAB = '\t';
const CRLF = '\r\n';

export const createDoseRateTSVFile = ({ data }) => {
  console.log('Data: ', data);
  const rows = [
    createRow([]),
    createFirstRow(),
    createSecondRow({ data }),
    createThirdRow({ data }),
    createForthRow({ data }),
    createFifthRow({ data }),
    createSixthRow({ data }),
    ...createRestRows({ data }),
  ];
  return replaceAll(rows.join(''), '.', ',');
};

const createFirstRow = () => {
  const array = [
    '',
    'Time, sec',
    'Concentration, M',
    '',
    'Dose rate P (Gy/s)',
    'Dose rate confidence interval',
  ];
  return createRow(array);
};

const createSecondRow = ({
  data: { finalData, doseRate, confidenceInterval },
}) => {
  const pointIsExist = finalData.length > 0;
  const array = [
    '',
    pointIsExist ? finalData[0].time : '',
    pointIsExist ? finalData[0].concentration : '',
    '',
    doseRate,
    confidenceInterval,
  ];
  return createRow(array);
};

const createThirdRow = ({ data: { finalData, unit } }) => {
  const pointIsExist = finalData.length > 1;
  const array = [
    '',
    pointIsExist ? finalData[1].time : '',
    pointIsExist ? finalData[1].concentration : '',
    '',
    `Yield, ${unit}`,
  ];
  return createRow(array);
};

const createForthRow = ({ data: { finalData, radYield } }) => {
  const pointIsExist = finalData.length > 2;
  const array = [
    '',
    pointIsExist ? finalData[2].time : '',
    pointIsExist ? finalData[2].concentration : '',
    '',
    radYield,
  ];
  return createRow(array);
};

const createFifthRow = ({ data: { finalData } }) => {
  const pointIsExist = finalData.length > 3;
  const array = [
    '',
    pointIsExist ? finalData[3].time : '',
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
    pointIsExist ? finalData[4].time : '',
    pointIsExist ? finalData[4].concentration : '',
    '',
    solutionDensity,
  ];
  return createRow(array);
};

const createRestRows = ({ data: { finalData } }) => {
  const result = finalData.slice(5).map(point => {
    return createRow(['', point.time, point.concentration]);
  });
  while (result.length < 10) {
    result.push(createRow(['', '', '']));
  }
  return result;
};

const createRow = array => array.join(TAB).concat(CRLF);
