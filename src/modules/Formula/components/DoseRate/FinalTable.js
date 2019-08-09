import React, { useReducer, useRef } from 'react';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';

import { calculateRowId, simpleReducer } from 'utils/utils';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import MaterialNumberInput from 'components/MaterialNumberInput';
import { finalTableColumnDefs, Units } from 'constants/common';
import Grid from 'components/Grid';
import { useWizardContext } from 'components/Wizard';
import Container from '../Container';
import Title from '../Title';
import Subtitle from '../Subtitle';
import ContentWrapper from '../ContentWrapper';
import styled from 'styled-components';

function FinalTable({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const [data, dispatch] = useReducer(simpleReducer, {
    solutionDensity: state.solutionDensity,
    radYield: state.radYield,
    finalData: state.finalData,
    unit: state.unit,
  });
  const [errors, errorDispatch] = useReducer(simpleReducer, {
    solutionDensity: '',
    radYield: '',
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
      radYield: Number.parseFloat(data.radYield),
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
    data.radYield &&
    (!errors.solutionDensity && !errors.radYield);

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
          <Subtitle>Enter parameters for calculating dose rate:</Subtitle>
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
            <NameCell>{`Yield G : (${data.unit})`}</NameCell>
            <InputCell>
              <MaterialNumberInput
                name="radYield"
                initialValue={data.radYield}
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
  flex: 0 0 230px;
`;

const InputCell = styled.div`
  flex: 1;
`;

export default FinalTable;
