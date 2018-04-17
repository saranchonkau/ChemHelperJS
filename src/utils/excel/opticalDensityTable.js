import {replaceAll} from "../utils";

const TAB = '\t';
const CRLF = '\r\n';

export const createOpticalDensityTableTSVFile = ({ data }) => {
    const rows = [
        createRow([]),
        createFirstRow(),
        createSecondRow({ data }),
        ...createRestRows({ data })
    ];
    return replaceAll(rows.join(''), '.', ',');
};

const createFirstRow = () => {
    const array = [
        '',
        'Optical density',
        'Concentration, M',
        '',
        'Path length (cm)',
        'Molar extinction coefficient (l/mol*cm)'
    ];
    return createRow(array);
};

const createSecondRow = ({ data: { opticalDensityData, pathLength, MAC } }) => {
    const pointIsExist = opticalDensityData.length > 0;
    const array = [
        '',
        pointIsExist ? opticalDensityData[0].density : '',
        pointIsExist ? opticalDensityData[0].concentration : '',
        '',
        pathLength,
        MAC
    ];
    return createRow(array);
};

const createRestRows = ({ data: { opticalDensityData } }) => {
    const result = opticalDensityData.slice(1).map(point => {
        return createRow([
            '',
            point.concentration,
            point.density
        ])
    });
    while(result.length < 14) {
        result.push(createRow([
            '',
            '',
            ''
        ]))
    }
    return result;
};

const createRow = array => array.join(TAB).concat(CRLF);
