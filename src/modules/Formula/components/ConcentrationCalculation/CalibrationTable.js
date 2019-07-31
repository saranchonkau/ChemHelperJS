import React, { useRef } from 'react';
import styled from 'styled-components';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import Grid from 'components/Grid';
import { useWizardContext } from 'components/Wizard';

import { calibrationTableColumnDefs } from 'constants/common';
import { calculateRowId } from 'utils/utils';

function CalibrationTable({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const api = useRef();

  const onGridReady = gridApi => {
    api.current = gridApi;
  };

  const addRow = () => {
    const rowData = api.current.getRowData();
    const newRow = {
      id: calculateRowId(rowData.map(data => data.id)),
      concentration: 0.0,
      density: 0.0,
      isSelected: true,
    };
    api.current.createRow(newRow);
  };

  const nextPage = () => {
    updateState({ initialData: api.current.getRowData() });
    nextStep();
  };

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
            <BackButton onClick={previousStep} />
            <AddRowButton onClick={addRow} />
            <NextButton onClick={nextPage} />
          </Footer>
        </Content>
      </ContentWrapper>
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

const Subtitle = styled.p`
  margin-top: 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  width: 525px;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

export default CalibrationTable;
