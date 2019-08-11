const { dialog } = require('electron');
// var Excel = require('exceljs');
// var XLSXChart = require ("xlsx-chart");
const fs = require('fs');
const path = require('path');

/*
const ConcentrationCalculationWays = {
    OWN_WAY: '5',
    MOLAR_ATTENUATION_COEFFICIENT_WAY: '1',
    CALIBRATION_TABLE_WAY: '2',
};

const getPatternPath = calculationWay => {
    switch(calculationWay){
        case ConcentrationCalculationWays.OWN_WAY: return path.resolve(__dirname, './radChemYield_Own_values.xlsx');
        case ConcentrationCalculationWays.MOLAR_ATTENUATION_COEFFICIENT_WAY: return path.resolve(__dirname, './radChemYield_MAC.xlsx');
        case ConcentrationCalculationWays.CALIBRATION_TABLE_WAY: return path.resolve(__dirname, './radChemYield_Calibration.xlsx');
        default: return path.resolve(__dirname, './radChemYield_Own_values.xlsx');
    }
};
*/

const PatternPaths = {
  RAD_CHEM_YIELD: path.resolve(__dirname, './Rad_chem_yield.xlsx'),
  QUANTUM_YIELD: path.resolve(__dirname, './Quantum_yield.xlsx'),
  DOSE_RATE: path.resolve(__dirname, './Dose_rate.xlsx'),
  CALIBRATION_TABLE: path.resolve(__dirname, './Calibration_table.xlsx'),
  OPTICAL_DENSITY_TABLE: path.resolve(
    __dirname,
    './Optical_density_table.xlsx',
  ),
};

/*
const getExcelPatternPath = patternType => {
    switch(patternType){
        case ConcentrationCalculationWays.OWN_WAY: return path.resolve(__dirname, './radChemYield_Own_values.xlsx');
        case ConcentrationCalculationWays.MOLAR_ATTENUATION_COEFFICIENT_WAY: return path.resolve(__dirname, './radChemYield_MAC.xlsx');
        case ConcentrationCalculationWays.CALIBRATION_TABLE_WAY: return path.resolve(__dirname, './radChemYield_Calibration.xlsx');
        default: return path.resolve(__dirname, './radChemYield_Own_values.xlsx');
    }
};

const TAB = '\t';
const CRLF = '\r\n';

const createYieldTSVFile = ({ data, fileName }) => {
    const rows = [
        createRow([]),
        createFirstRow({ unit: data.unit }),
        createSecondRow({ data }),
        createThirdRow({ data }),
        createForthRow({ data }),
        createFifthRow({ data }),
        createSixthRow({ data }),
        ...createRestRows({ data })
    ];
    const file = rows.join('');
    const dataFileName = fileName.substr(0, fileName.lastIndexOf(".")) + ".txt";
    fs.writeFile(dataFileName, file, err => console.log('Data was successfully wrote!'))
};

const createFirstRow = ({ unit }) => {
    const array = [
        '',
        'Absorbed dose, Gray',
        'Concentration, M',
        '',
        `Yield, ${unit}`,
        'Yield confidence interval'
    ];
    return createRow(array);
};

const createSecondRow = ({ data: { finalData, yield, confidenceInterval } }) => {
    const pointIsExist = finalData.length > 0;
    const array = [
        '',
        pointIsExist ? finalData[0].dose : '',
        pointIsExist ? finalData[0].concentration : '',
        '',
        yield,
        confidenceInterval
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
        'Dose rate P (Gy/s)'
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
        doseRate
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
        'Solution density (g/ml)'
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
        solutionDensity
    ];
    return createRow(array);
};

const createRestRows = ({ data: { finalData } }) => {
    const restRows = [];
    if (finalData.length > 5) {
        for(let i = 5; i < finalData.length; i++) {
            let array = [
                '',
                finalData[i].dose,
                finalData[i].concentration
            ];
            restRows.push(createRow(array));
        }
    }
    return restRows;
};

const createRow = array => array.join(TAB).concat(CRLF);

exports.exportTableDataOnly = ({ mainWindow, data }) => {
    showSaveDialog({
        mainWindow,
        callBack: fillWorkbook(data)
    })
};

exports.exportTableDataWithCharts = ({ mainWindow, data }) => {
    showSaveDialog({
        mainWindow,
        callBack: copyPatternAndSaveData(data)
    })
};
*/

exports.savePattern = ({ mainWindow, type }) => {
  showSaveDialog({
    mainWindow,
    callBack: copyPattern(type),
  });
};

const copyPattern = type => fileName => {
  if (fileName && path.extname(fileName) === '.xlsx') {
    const writeStream = fs.createWriteStream(fileName);
    writeStream.on('finish', () => showMessageBox());
    writeStream.on('error', error => showErrorBox(error));
    fs.createReadStream(PatternPaths[type]).pipe(writeStream);
  }
};

/*
const copyPatternAndSaveData = data => fileName => {
    if (fileName && path.extname(fileName) === '.xlsx') {
        fs.createReadStream(getPatternPath(data.calculationWay)).pipe(fs.createWriteStream(fileName));
        // createYieldTSVFile({ data, fileName });
        showMessageBox();
    }
};

const fillWorkbook = data => fileName => {
    if (fileName && path.extname(fileName) === '.xlsx') {
        const workbook = new Excel.Workbook();
        workbook.xlsx.readFile(getPatternPath(data.calculationWay))
            .then(workbook => {
                fillWorksheets({ workbook, data });
                workbook.xlsx.writeFile(fileName).then(() => showMessageBox());
            })
            .catch(error => {
                console.log('Some error');
                console.log(error);
            });
    }
};

const fillWorksheets = ({ workbook, data }) => {
    switch(data.calculationWay) {
        case ConcentrationCalculationWays.MOLAR_ATTENUATION_COEFFICIENT_WAY: fillMACWorksheet({ workbook, data }); break;
        case ConcentrationCalculationWays.CALIBRATION_TABLE_WAY: fillCalibrationWorksheet({ workbook, data }); break;
    }
    fillYieldWorksheet({ workbook, data });
};

const fillCalibrationWorksheet = ({ workbook, data }) => {
    const worksheet = workbook.getWorksheet('Calibration');
    data.initialData.forEach((point, index) => {
        let row = worksheet.getRow(index + 3);
        row.getCell('B').value = point.concentration;
        row.getCell('C').value = point.density;
    })
};

const fillMACWorksheet = ({ workbook, data }) => {
    const worksheet = workbook.getWorksheet('Calibration');
    data.opticalDensityData.forEach((point, index) => {
        let row = worksheet.getRow(index + 3);
        row.getCell('C').value = point.concentration;
        row.getCell('B').value = point.density;
    });
    worksheet.getRow(3).getCell('E').value = data.pathLength;
    worksheet.getRow(3).getCell('F').value = data.MAC;
};

const fillYieldWorksheet = ({ workbook, data }) => {
    const worksheet = workbook.getWorksheet('Yield');
    data.finalData.forEach((point, index) => {
        let row = worksheet.getRow(index + 3);
        row.getCell('B').value = point.dose;
        row.getCell('C').value = point.concentration;
    });
    worksheet.getRow(3).getCell('E').value = data.yield;
    worksheet.getRow(3).getCell('F').value = data.confidenceInterval;
    worksheet.getRow(5).getCell('E').value = data.doseRate;
    worksheet.getRow(7).getCell('E').value = data.solutionDensity;
};
*/

const showMessageBox = () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'ChemHelper',
    message: 'Excel file was successfully saved !',
    buttons: ['OK'],
  });
};

const showErrorBox = error => {
  console.log(`Error: ${error.message}`);
  dialog.showErrorBox(
    'Error',
    'Some error has occurred. Please contact with administrator and try to save file again.',
  );
};

const showSaveDialog = ({ mainWindow, callBack }) => {
  dialog.showSaveDialog(
    mainWindow,
    {
      title: 'Choose path',
      defaultPath: `${process.env.USERPROFILE}\\Desktop`,
      filters: [{ name: 'Excel files', extensions: ['xlsx'] }],
    },
    fileName => {
      console.log(`FileName = [${fileName}]`);
      callBack(fileName);
    },
  );
};
