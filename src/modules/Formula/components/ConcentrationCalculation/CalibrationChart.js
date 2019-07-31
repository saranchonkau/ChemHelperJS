import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';

import {
  ExcelPatternTypes,
  getTrendResult,
  RSquared,
  suggestMaxValue,
  suggestMinValue,
  Equation,
} from 'utils/utils';
import { chartOptions, datasets } from 'utils/charts';
import { createCalibrationTableTSVFile } from 'utils/excel/calibrationTable';

import NextButton from 'components/NextButton';
import BackButton from 'components/BackButton';
import CopyButton from 'components/CopyButton';
import SavePatternButton from 'components/SavePatternButton';
import { useWizardContext } from 'components/Wizard';

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

  const result = getTrendResult(getSelectedData());
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Calibration chart</Subtitle>
      <ContentWrapper>
        <Content>
          <Line {...getChartProps()} />
          <Equation slope={result.slope} intercept={result.intercept} />
          <br />
          <RSquared rSquared={result.rSquared} />
          <Footer>
            <BackButton onClick={previousStep} />
            <CopyButton
              text={createCalibrationTableTSVFile({
                data: getExportData(),
              })}
            />
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
  width: 700px;
  height: 100%;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

export default CalibrationChart;
