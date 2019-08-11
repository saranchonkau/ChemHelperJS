import { replaceAll } from '../common';

const TAB = '\t';
const CRLF = '\r\n';

/*
data = {
    volume: Number,
    lightIntensity: Number,
    finalData: [ ..., { time: Number, concentration: Number }, ... ],
    quantumYield: Number,
    confidenceInterval: Number
}
*/

export const createQuantumYieldTSVFile = ({ data }) => {
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
    'Quantum yield',
    'Quantum yield confidence interval',
  ];
  return createRow(array);
};

const createSecondRow = ({ data }) => {
  const pointIsExist = data.finalData.length > 0;
  const array = [
    '',
    pointIsExist ? data.finalData[0].time : '',
    pointIsExist ? data.finalData[0].concentration : '',
    '',
    data.quantumYield,
    data.confidenceInterval,
  ];
  return createRow(array);
};

const createThirdRow = ({ data: { finalData } }) => {
  const pointIsExist = finalData.length > 1;
  const array = [
    '',
    pointIsExist ? finalData[1].time : '',
    pointIsExist ? finalData[1].concentration : '',
    '',
    'Light intensity I (photon/s)',
  ];
  return createRow(array);
};

const createForthRow = ({ data: { finalData, lightIntensity } }) => {
  const pointIsExist = finalData.length > 2;
  const array = [
    '',
    pointIsExist ? finalData[2].time : '',
    pointIsExist ? finalData[2].concentration : '',
    '',
    lightIntensity,
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
    'Volume V (ml)',
  ];
  return createRow(array);
};

const createSixthRow = ({ data: { finalData, volume } }) => {
  const pointIsExist = finalData.length > 4;
  const array = [
    '',
    pointIsExist ? finalData[4].time : '',
    pointIsExist ? finalData[4].concentration : '',
    '',
    volume,
  ];
  return createRow(array);
};

const createRestRows = ({ data: { finalData } }) => {
  const result = finalData.slice(5).map(point => {
    return createRow(['', point.time, point.concentration]);
  });
  // TODO replace with result.fill(value, startPosition, endPosition)
  while (result.length < 10) {
    result.push(createRow(['', '', '']));
  }
  return result;
};

const createRow = array => array.join(TAB).concat(CRLF);
