import React, { useReducer, useRef } from 'react';
import styled from 'styled-components';
import { MenuItem, Select } from '@material-ui/core';

import { calculateRowId, simpleReducer } from 'utils/utils';

import { finalTableColumnDefs, Units } from 'constants/common';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import MaterialNumberInput from 'components/MaterialNumberInput';
import Grid from 'components/Grid';
import { useWizardContext } from 'components/Wizard';

import Container from '../Container';
import Title from '../Title';
import Subtitle from '../Subtitle';
import ContentWrapper from '../ContentWrapper';

function FinalTable({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const [data, dispatch] = useReducer(simpleReducer, {
    solutionDensity: state.solutionDensity,
    doseRate: state.doseRate,
    finalData: state.finalData,
    unit: state.unit,
  });
  const [errors, errorDispatch] = useReducer(simpleReducer, {
    solutionDensity: '',
    doseRate: '',
  });

  const api = useRef();

  const onGridReady = gridApi => {
    api.current = gridApi;
  };

  const addRow = () => {
    const rowData = api.current.getRowData();
    const newRow = {
      id: calculateRowId(rowData.map(data => data.id)),
      concentration: 0.0,
      time: 0.0,
      isSelected: true,
    };
    api.current.createRow(newRow);
  };

  const nextPage = () => {
    updateState({
      finalData: api.current.getRowData(),
      unit: data.unit,
      doseRate: Number.parseFloat(data.doseRate),
      solutionDensity: Number.parseFloat(data.solutionDensity),
    });
    nextStep();
  };

  const previousPage = () => {
    updateState({
      finalData: api.current.getRowData(),
    });
    previousStep();
  };

  const handleChange = event =>
    dispatch({ [event.target.name]: event.target.value });

  const handleNumberChange = ({ value, error, name }) => {
    dispatch({ [name]: value });
    errorDispatch({ [name]: error });
  };

  const isCorrectData =
    data.solutionDensity &&
    data.doseRate &&
    (!errors.solutionDensity && !errors.doseRate);

  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Final table</Subtitle>
      <ContentWrapper>
        <Content>
          <StyledGrid
            data={data.finalData}
            options={{ columnDefs: finalTableColumnDefs }}
            onGridReady={onGridReady}
          />
          <ButtonRow>
            <BackButton onClick={previousPage} />
            <AddRowButton onClick={addRow} />
            <NextButton onClick={nextPage} disabled={!isCorrectData} />
          </ButtonRow>
          <Subtitle>Enter parameters for calculating yield:</Subtitle>
          <Row>
            <NameCell>Solution density &rho; (g/ml):</NameCell>
            <InputCell>
              <MaterialNumberInput
                name="solutionDensity"
                initialValue={data.solutionDensity}
                onChange={handleNumberChange}
              />
            </InputCell>
          </Row>
          <Row>
            <NameCell>Dose rate P (Gy/s):</NameCell>
            <InputCell>
              <MaterialNumberInput
                name="doseRate"
                initialValue={data.doseRate}
                onChange={handleNumberChange}
              />
            </InputCell>
          </Row>
          <Row>
            <NameCell>Unit of measure of yield:</NameCell>
            <InputCell>
              <Select value={data.unit} name="unit" onChange={handleChange}>
                <MenuItem value={Units.moleculesPerHundredVolt}>
                  {Units.moleculesPerHundredVolt}
                </MenuItem>
                <MenuItem value={Units.molPerJoule}>
                  {Units.molPerJoule}
                </MenuItem>
              </Select>
            </InputCell>
          </Row>
        </Content>
      </ContentWrapper>
    </Container>
  );
}

const Content = styled.div`
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

export default FinalTable;
