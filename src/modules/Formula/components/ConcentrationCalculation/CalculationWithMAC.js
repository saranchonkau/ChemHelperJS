import React, { useReducer, useRef } from 'react';
import pick from 'lodash/pick';
import styled from 'styled-components';

import { calculateRowId, ExcelPatternTypes, simpleReducer } from 'utils/utils';

import { calculationWithMACColumnDefs } from 'constants/common';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import MaterialButton from 'components/MaterialButton';
import SavePatternButton from 'components/SavePatternButton';
import CopyButton from 'components/CopyButton';
import MaterialNumberInput from 'components/MaterialNumberInput';
import Grid from 'components/Grid';
import { useWizardContext } from 'components/Wizard';

import { createOpticalDensityTableTSVFile } from 'utils/excel/opticalDensityTable';

function CalculationWithMAC({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const api = useRef();

  const [data, dispatch] = useReducer(
    simpleReducer,
    pick(state, ['opticalDensityData', 'pathLength', 'MAC']),
  );
  const [errors, errorDispatch] = useReducer(simpleReducer, {
    pathLength: '',
    MAC: '',
  });

  function onGridReady(api) {
    api.current = api;
  }

  function addRow() {
    const rowData = api.current.getRowData();
    const newRow = {
      id: calculateRowId(rowData.map(data => data.id)),
      density: 0.0,
      isSelected: true,
    };
    api.current.createRow(newRow);
  }

  function modifyFinalData() {
    return api.current.getRowData().map(point => {
      const foundPoint = state.finalData.find(
        finalPoint => finalPoint.id === point.id,
      );
      return {
        id: point.id,
        time: foundPoint ? foundPoint.time : 0.0,
        concentration: point.density / (data.pathLength * data.MAC),
        density: point.density,
        isSelected: true,
      };
    });
  }

  function getOpticalDensityData() {
    return api.current
      ? api.current.getRowData().map(point => ({
          ...point,
          concentration: point.density / (data.pathLength * data.MAC),
        }))
      : [];
  }

  const getExportData = () => ({
    opticalDensityData: getOpticalDensityData(),
    pathLength: data.pathLength,
    MAC: data.MAC,
  });

  const nextPage = () => {
    updateState({
      finalData: modifyFinalData(),
      opticalDensityData: getOpticalDensityData(),
      pathLength: Number.parseFloat(data.pathLength),
      MAC: Number.parseFloat(data.MAC),
    });
    nextStep();
  };

  const previousPage = () => {
    updateState({
      pathLength: 0,
      MAC: 0,
    });
    previousStep();
  };

  const handleNumberChange = name => ({ value, error }) => {
    dispatch({ [name]: value });
    errorDispatch({ [name]: error });
  };

  const isCorrectData = () => {
    return data.pathLength && data.MAC && !errors.pathLength && !errors.MAC;
  };

  const { pathLength, MAC, opticalDensityData } = data;
  return (
    <Container>
      <Title>{title}</Title>
      <h5 className="text-center">
        Calculation with molar extinction coefficient
      </h5>
      <div className="d-flex justify-content-center">
        <div style={{ width: 600 }}>
          <Grid
            data={opticalDensityData}
            options={{ columnDefs: calculationWithMACColumnDefs }}
            onGridReady={onGridReady}
          />
          <div className="d-flex flex-row justify-content-between">
            <BackButton onClick={previousPage} />
            <MaterialButton
              text={'Calculate concentrations'}
              onClick={() =>
                dispatch({ opticalDensityData: getOpticalDensityData() })
              }
              disabled={!isCorrectData() || opticalDensityData.length === 0}
            />
            <AddRowButton onClick={addRow} />
            <NextButton onClick={nextPage} disabled={!isCorrectData()} />
          </div>
          <h5 className="my-3 text-center">
            Enter parameters for calculating concentrations:
          </h5>
          <table>
            <tbody>
              <tr>
                <td>Path length (cm):</td>
                <td>
                  <MaterialNumberInput
                    id={'pathLength-input'}
                    initialValue={pathLength}
                    onChange={handleNumberChange('pathLength')}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ width: 200 }}>
                  Molar attenuation coefficient &#949; (l/(mol&middot;cm)):
                </td>
                <td>
                  <MaterialNumberInput
                    id={'MAC-input'}
                    initialValue={MAC}
                    onChange={handleNumberChange('MAC')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex justify-content-end">
            <CopyButton
              text={createOpticalDensityTableTSVFile({
                data: getExportData(),
              })}
              disabled={!isCorrectData()}
            />
            <SavePatternButton
              patternType={ExcelPatternTypes.OPTICAL_DENSITY_TABLE}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.header`
  font-size: 30px;
  margin: 2rem auto 1rem auto;
  text-align: center;
`;

export default CalculationWithMAC;
