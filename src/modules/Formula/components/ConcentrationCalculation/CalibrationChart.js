import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';

import { getTrendResult, suggestMaxValue, suggestMinValue } from 'utils/utils';
import { chartOptions, datasets } from 'utils/charts';
import { createCalibrationTableTSVFile } from 'utils/excel/calibrationTable';

import { ExcelPatternTypes } from 'constants/common';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import CopyButton from 'components/CopyButton';
import SavePatternButton from 'components/SavePatternButton';
import { useWizardContext } from 'components/Wizard';
import LineEquation from 'components/LineEquation';
import RSquaredEquation from 'components/RSquaredEquation';

import Container from '../Container';
import Title from '../Title';
import Subtitle from '../Subtitle';
import ContentWrapper from '../ContentWrapper';

function CalibrationChart({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const exportData = state.initialData.filter(point => point.isSelected);

  const selectedData = state.initialData
    .filter(point => point.isSelected)
    .map(data => ({ x: data.concentration, y: data.density }));

  const unselectedData = state.initialData
    .filter(point => point.isSelected)
    .map(data => ({ x: data.concentration, y: data.density }));

  const result = getTrendResult(selectedData);

  const trendData = selectedData.map(point => ({
    x: point.x,
    y: result.predictY(point.x), // Trend function
  }));

  const nextPage = () => {
    updateState({ trendFunc: result.predictX });
    nextStep();
  };

  const xArray = state.initialData.map(point => point.concentration);

  const chartProps = {
    data: {
      datasets: [
        datasets.selectedData({ data: selectedData }),
        datasets.unselectedData({ data: unselectedData }),
        datasets.trendData({ data: trendData }),
      ],
    },
    options: chartOptions({
      tooltipLabelCallback: (tooltipItem, data) => [
        `Optical density: ${tooltipItem.yLabel}`,
        `Concentration: ${tooltipItem.xLabel} mol/l`,
      ],
      xLabel: 'Concentration, M',
      yLabel: 'Optical density, D',
      xTicksMin: suggestMinValue(xArray),
      xTicksMax: suggestMaxValue(xArray),
    }),
  };

  const tsvFile = createCalibrationTableTSVFile({
    data: exportData,
  });
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Calibration chart</Subtitle>
      <ContentWrapper>
        <Content>
          <Line {...chartProps} />
          <LineEquation slope={result.slope} intercept={result.intercept} />
          <br />
          <RSquaredEquation rSquared={result.rSquared} />
          <Footer>
            <BackButton onClick={previousStep} />
            <CopyButton text={tsvFile} />
            <SavePatternButton
              patternType={ExcelPatternTypes.CALIBRATION_TABLE}
            />
            <NextButton onClick={nextPage} />
          </Footer>
        </Content>
      </ContentWrapper>
    </Container>
  );
}

const Content = styled.div`
  width: 700px;
  height: 100%;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

export default CalibrationChart;
