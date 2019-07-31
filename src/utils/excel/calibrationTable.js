import { replaceAll } from '../utils';

const TAB = '\t';
const CRLF = '\r\n';

export const createCalibrationTableTSVFile = ({ data }) => {
  const rows = [createRow([]), createFirstRow(), ...createRestRows({ data })];
  return replaceAll(rows.join(''), '.', ',');
};

const createFirstRow = () => {
  const array = ['', 'Optical density', 'Concentration, M'];
  return createRow(array);
};

const createRestRows = ({ data }) => {
  const result = data.map(point => {
    return createRow(['', point.concentration, point.density]);
  });
  while (result.length < 15) {
    result.push(createRow(['', '', '']));
  }
  return result;
};

const createRow = array => array.join(TAB).concat(CRLF);
