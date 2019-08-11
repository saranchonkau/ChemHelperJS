import numeral from 'numeral';

export const dotRegexp = /[,/\u0431\u044E]/;
export const finalNumberRegexp = /^[+-]?\d*\.?\d+(?:[Ee][+-]?\d{1,2})?$/;
export const intermediateNumberRegexp = /^[+-]?(?:\d*(?:\.?(?:\d+(?:(?:(?:[Ee]\+)|(?:[Ee]-)|(?:[Ee]))?(?:\d{1,2})?)?)?)?)?$/;

export function simpleReducer(state, payload) {
  return { ...state, ...payload };
}

// for test purposes
// window.globalTrendFunction = () => {
//   return getTrendResult([
//     { x: 1.47, y: 52.21 },
//     { x: 1.5, y: 53.12 },
//     { x: 1.52, y: 54.48 },
//     { x: 1.55, y: 55.84 },
//     { x: 1.57, y: 57.2 },
//     { x: 1.6, y: 58.57 },
//     { x: 1.63, y: 59.93 },
//     { x: 1.65, y: 61.29 },
//     { x: 1.68, y: 63.11 },
//     { x: 1.7, y: 64.47 },
//     { x: 1.73, y: 66.28 },
//     { x: 1.75, y: 68.1 },
//     { x: 1.78, y: 69.92 },
//     { x: 1.8, y: 72.19 },
//     { x: 1.83, y: 74.46 },
//   ]);
// };

export const getNumberWithSign = num => {
  if (num > 0) {
    return `+${num}`;
  } else if (num < 0) {
    return num;
  } else {
    return '';
  }
};

export const expFormat = num => {
  let formatted = numeral(num).format('0.00000e+0');
  let parts = formatted.split('e');
  let power = parseInt(parts[1], 10);
  return power === 0 ? parts[0] : `${parts[0]}\\cdot{10^{${power}}}`;
};

export const expFormatWithSign = num => {
  let formatted = numeral(num).format('+0.00000e+0');
  let parts = formatted.split('e');
  let power = parseInt(parts[1], 10);
  return power === 0 ? parts[0] : `${parts[0]}\\cdot{10^{${power}}}`;
};

export const numberParser = params => {
  const newValue = params.newValue
    .replace(dotRegexp, '.')
    .replace(/[\u0435\u0443]/, 'e');
  return Number.parseFloat(newValue);
};

export const numberFormatter = params => {
  if (Number.isNaN(params.value)) {
    return params.value;
  } else {
    return numeral(params.value).format('0.00000e+0');
  }
};

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
  if (prevstring && string === prevstring) return string;
  prevstring = string.replace(omit, place);
  return replaceAll(prevstring, omit, place, string);
};
