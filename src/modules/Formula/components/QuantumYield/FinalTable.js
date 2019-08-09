import React, { useReducer, useRef } from 'react';
import styled from 'styled-components';

import { calculateRowId, simpleReducer } from 'utils/utils';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import MaterialNumberInput from 'components/MaterialNumberInput';
import { finalTableColumnDefs } from 'constants/common';
import Grid from 'components/Grid';
import { useWizardContext } from 'components/Wizard';

import Container from '../Container';
import Title from '../Title';
import Subtitle from '../Subtitle';
import ContentWrapper from '../ContentWrapper';

function FinalTable({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const [data, dispatch] = useReducer(simpleReducer, {
    lightIntensity: state.lightIntensity,
    volume: state.volume,
    finalData: state.finalData,
  });
  const [errors, errorDispatch] = useReducer(simpleReducer, {
    lightIntensity: '',
    volume: '',
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
      volume: Number.parseFloat(data.volume),
      lightIntensity: Number.parseFloat(data.lightIntensity),
    });
    nextStep();
  };

  const previousPage = () => {
    updateState({
      finalData: api.current.getRowData(),
    });
    previousStep();
  };

  const handleNumberChange = ({ value, error, name }) => {
    dispatch({ [name]: value });
    errorDispatch({ [name]: error });
  };

  const isCorrectData =
    data.volume &&
    data.lightIntensity &&
    (!errors.volume && !errors.lightIntensity);

  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Final table</Subtitle>
      <ContentWrapper>
        <Content>
          <Grid
            data={data.finalData}
            options={{ columnDefs: finalTableColumnDefs }}
            onGridReady={onGridReady}
          />
          <ButtonRow>
            <BackButton onClick={previousPage} />
            <AddRowButton onClick={addRow} />
            <NextButton onClick={nextPage} disabled={!isCorrectData} />
          </ButtonRow>
          <Subtitle>Enter parameters for calculating quantum yield:</Subtitle>
          <Row>
            <NameCell>Light intensity I (photon/s):</NameCell>
            <InputCell>
              <MaterialNumberInput
                name="lightIntensity"
                initialValue={data.lightIntensity}
                onChange={handleNumberChange}
              />
            </InputCell>
          </Row>
          <Row>
            <NameCell>Volume V (ml):</NameCell>
            <InputCell>
              <MaterialNumberInput
                name="volume"
                initialValue={data.volume}
                onChange={handleNumberChange}
              />
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
  flex: 0 0 130px;
`;

const InputCell = styled.div`
  flex: 1;
`;

export default FinalTable;
