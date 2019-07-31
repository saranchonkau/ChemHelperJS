import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';

import {
  ExcelPatternTypes,
  getTrendResult,
  suggestMaxValue,
  suggestMinValue,
} from 'utils/utils';
import { chartOptions, datasets } from 'utils/charts';
import { createCalibrationTableTSVFile } from 'utils/excel/calibrationTable';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import CopyButton from 'components/CopyButton';
import SavePatternButton from 'components/SavePatternButton';
import { useWizardContext } from 'components/Wizard';
import LineEquation from 'components/LineEquation';
import RSquaredEquation from 'components/RSquaredEquation';

import Container from './components/Container';
import Title from './components/Title';
import Subtitle from './components/Subtitle';
import ContentWrapper from './components/ContentWrapper';

function CalibrationChart({ title }) {
  const { nextStep, previousStep, updateState, state } = useWizardContext();

  const getExportData = () =>
    state.initialData.filter(point => point.isSelected);

  const getSelectedData = () => {
    return state.initialData
      .filter(point => point.isSelected)
      .map(data => ({ x: data.concentration, y: data.density }));
  };

  const getUnselectedData = () => {
    return state.initialData
      .filter(point => !point.isSelected)
      .map(data => ({ x: data.concentration, y: data.density }));
  };

  const getTrendData = () => {
    const data = getSelectedData();
    const trendFunc = getTrendResult(data).predictY;
    return data.map(point => ({ x: point.x, y: trendFunc(point.x) }));
  };

  const nextPage = () => {
    const data = getSelectedData();
    updateState({ trendFunc: getTrendResult(data).predictX });
    nextStep();
  };

  const getChartProps = () => {
    const xArray = state.initialData.map(point => point.concentration);
    return {
      data: {
        datasets: [
          datasets.selectedData({ data: getSelectedData() }),
          datasets.unselectedData({ data: getUnselectedData() }),
          datasets.trendData({ data: getTrendData() }),
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
  };

  const tsvFile = createCalibrationTableTSVFile({
    data: getExportData(),
  });
  const result = getTrendResult(getSelectedData());
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Calibration chart</Subtitle>
      <ContentWrapper>
        <Content>
          <Line {...getChartProps()} />
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
