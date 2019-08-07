import React, { useRef } from 'react';
import styled from 'styled-components';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import Grid from 'components/Grid';
import { useWizardContext } from 'components/Wizard';

import { calibrationTableColumnDefs } from 'constants/common';
import { calculateRowId, PageNumbers } from 'utils/utils';

import Container from './components/Container';
import Title from './components/Title';
import Subtitle from './components/Subtitle';
import ContentWrapper from './components/ContentWrapper';

function CalibrationTable({ title }) {
  const { nextStep, setStep, updateState, state } = useWizardContext();

  const api = useRef();

  const onGridReady = gridApi => {
    api.current = gridApi;
  };

  const addRow = () => {
    const rowData = api.current.getRowData();
    const newRow = {
      id: calculateRowId(rowData.map(data => data.id)),
      density: 0.0,
      concentration: 0.0,
      isSelected: true,
    };
    api.current.createRow(newRow);
  };

  const nextPage = () => {
    updateState({ initialData: api.current.getRowData() });
    nextStep();
  };

  const prevPage = () =>
    setStep(PageNumbers.CONCENTRATION_CALCULATION_WAY_SELECTION);

  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Calibration table</Subtitle>
      <ContentWrapper>
        <Content>
          <Grid
            data={state.initialData}
            options={{ columnDefs: calibrationTableColumnDefs }}
            onGridReady={onGridReady}
          />
          <Footer>
            <BackButton onClick={prevPage} />
            <AddRowButton onClick={addRow} />
            <NextButton onClick={nextPage} />
          </Footer>
        </Content>
      </ContentWrapper>
    </Container>
  );
}

const Content = styled.div`
  width: 525px;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

export default CalibrationTable;
