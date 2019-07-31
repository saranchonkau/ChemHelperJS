import React, { useReducer, useRef } from 'react';
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

import Subtitle from './components/Subtitle';
import ContentWrapper from './components/ContentWrapper';
import Container from './components/Container';
import Title from './components/Title';

function CalculationWithMAC({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const api = useRef();

  const [data, dispatch] = useReducer(simpleReducer, {
    pathLength: state.pathLength,
    MAC: state.MAC,
    opticalDensityData: state.opticalDensityData,
  });
  const [errors, errorDispatch] = useReducer(simpleReducer, {
    pathLength: '',
    MAC: '',
  });

  function onGridReady(gridApi) {
    api.current = gridApi;
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

  const handleNumberChange = ({ value, error, name }) => {
    dispatch({ [name]: value });
    errorDispatch({ [name]: error });
  };

  const isCorrectData = () => {
    return data.pathLength && data.MAC && !errors.pathLength && !errors.MAC;
  };

  const tsvFile = createOpticalDensityTableTSVFile({
    data: getExportData(),
  });

  const { pathLength, MAC, opticalDensityData } = data;
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Calculation with molar extinction coefficient</Subtitle>
      <ContentWrapper>
        <Content>
          <StyledGrid
            data={opticalDensityData}
            options={{ columnDefs: calculationWithMACColumnDefs }}
            onGridReady={onGridReady}
          />
          <ButtonRow>
            <BackButton onClick={previousPage} />
            <MaterialButton
              text={'Calculate concentrations'}
              onClick={() =>
                dispatch({ opticalDensityData: getOpticalDensityData() })
              }
              disabled={!isCorrectData()}
            />
            <AddRowButton onClick={addRow} />
            <NextButton onClick={nextPage} disabled={!isCorrectData()} />
          </ButtonRow>
          <Subtitle>Enter parameters for calculating concentrations:</Subtitle>
          <Row>
            <NameCell>Path length (cm):</NameCell>
            <InputCell>
              <MaterialNumberInput
                initialValue={pathLength}
                name="pathLength"
                onChange={handleNumberChange}
              />
            </InputCell>
          </Row>
          <Row>
            <NameCell>
              Molar attenuation coefficient &#949; (l/(mol&middot;cm)):
            </NameCell>
            <InputCell>
              <MaterialNumberInput
                initialValue={MAC}
                name="MAC"
                onChange={handleNumberChange}
              />
            </InputCell>
          </Row>
          <Footer>
            <CopyButton text={tsvFile} disabled={!isCorrectData()} />
            <SavePatternButton
              patternType={ExcelPatternTypes.OPTICAL_DENSITY_TABLE}
            />
          </Footer>
        </Content>
      </ContentWrapper>
    </Container>
  );
}

const Content = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
`;

const StyledGrid = styled(Grid)`
  align-self: center;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const NameCell = styled.div`
  flex: 0 0 200px;
`;

const InputCell = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default CalculationWithMAC;
