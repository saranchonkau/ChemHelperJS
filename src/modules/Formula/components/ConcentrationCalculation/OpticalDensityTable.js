import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import { calculateRowId } from 'utils/common';

import { opticalDensityTableColumnDefs } from 'constants/common';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import AddRowButton from 'components/AddRowButton';
import MaterialButton from 'components/MaterialButton';
import Grid from 'components/Grid';
import { useWizardContext } from 'components/Wizard';

import Container from '../Container';
import Title from '../Title';
import Subtitle from '../Subtitle';
import ContentWrapper from '../ContentWrapper';

function OpticalDensityTable({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const [opticalDensityData, setOpticalDensityData] = useState(
    state.opticalDensityData,
  );
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

  const modifyFinalData = () => {
    return api.current.getRowData().map(point => {
      const foundPoint = state.finalData.find(
        finalPoint => finalPoint.id === point.id,
      );
      return {
        id: point.id,
        time: foundPoint ? foundPoint.time : 0.0,
        concentration: state.trendFunc(point.density),
        density: point.density,
        isSelected: true,
      };
    });
  };

  const calculateConcentrations = () => {
    const calculatedData = api.current.getRowData().map(point => ({
      ...point,
      concentration: state.trendFunc(point.density),
    }));
    setOpticalDensityData(calculatedData);
  };

  const nextPage = () => {
    updateState({
      finalData: modifyFinalData(),
      opticalDensityData: api.current.getRowData(),
    });

    nextStep();
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Optical density table</Subtitle>
      <ContentWrapper>
        <Content>
          <Grid
            data={opticalDensityData}
            options={{ columnDefs: opticalDensityTableColumnDefs }}
            onGridReady={onGridReady}
          />
          <Footer>
            <BackButton onClick={previousStep} />
            <MaterialButton
              onClick={calculateConcentrations}
              disabled={opticalDensityData.length === 0}
            >
              Calculate concentrations
            </MaterialButton>
            <AddRowButton onClick={addRow} />
            <NextButton onClick={nextPage} />
          </Footer>
        </Content>
      </ContentWrapper>
    </Container>
  );
}

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Content = styled.div`
  width: 600px;
`;

export default OpticalDensityTable;
