import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

import { suggestMaxValue, suggestMinValue } from 'utils/common';
import { chartOptions, datasets } from 'utils/charts';
import { createDoseRateTSVFile } from 'utils/excel/doseRate';
import { calculateDoseRate, getTrendResult } from 'utils/calculations';

import BackButton from 'components/BackButton';
import SavePatternButton from 'components/SavePatternButton';
import CopyButton from 'components/CopyButton';
import { useWizardContext } from 'components/Wizard';
import LineEquation from 'components/LineEquation';
import RSquaredEquation from 'components/RSquaredEquation';
import CalculationResult from 'components/CalculationResult';

import { ExcelPatternTypes } from 'constants/common';

import Container from '../Container';
import Title from '../Title';
import Subtitle from '../Subtitle';
import ContentWrapper from '../ContentWrapper';

function FinalChart({ title }) {
  const { previousStep, state } = useWizardContext();

  const data = state.finalData.map(point => ({
    ...point,
    time: point.time * 60,
  }));

  const selectedData = data
    .filter(point => point.isSelected)
    .map(data => ({ x: data.time, y: data.concentration }));

  const unselectedData = data
    .filter(point => !point.isSelected)
    .map(data => ({ x: data.time, y: data.concentration }));

  const result = getTrendResult(selectedData);

  const doseRate = calculateDoseRate({
    slope: result.slope,
    density: state.solutionDensity,
    radYield: state.radYield,
    unit: state.unit,
  });

  const confidenceInterval = result.slopeConfidenceInterval
    ? calculateDoseRate({
        slope: result.slopeConfidenceInterval,
        density: state.solutionDensity,
        radYield: state.radYield,
        unit: state.unit,
      })
    : 0;

  const trendData = selectedData.map(point => ({
    x: point.x,
    y: result.predictY(point.x), // Trend function
  }));

  const exportData = {
    ...state,
    finalData: data.filter(point => point.isSelected),
    doseRate,
    confidenceInterval,
  };

  const xArray = data.map(point => point.time);
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
        `Concentration: ${tooltipItem.yLabel} mol/l`,
        `Time: ${tooltipItem.xLabel} sec`,
      ],
      xLabel: 'Time, sec',
      yLabel: 'Concentration, M',
      xTicksMin: suggestMinValue(xArray),
      xTicksMax: suggestMaxValue(xArray),
    }),
  };

  const tsvFile = createDoseRateTSVFile({ data: exportData });
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>Final chart</Subtitle>
      <ContentWrapper>
        <Content>
          <Line {...chartProps} />
          <LineEquation slope={result.slope} intercept={result.intercept} />
          <br />
          <RSquaredEquation rSquared={result.rSquared} />
          <br />
          <KatexText>Confidence interval: 95%</KatexText>
          <br />
          <CalculationResult
            name="DoseRate"
            value={doseRate}
            error={confidenceInterval}
            unit="Gy/s"
          />
          <Footer>
            <BackButton onClick={previousStep} />
            <CopyButton text={tsvFile} />
            <SavePatternButton patternType={ExcelPatternTypes.DOSE_RATE} />
          </Footer>
        </Content>
      </ContentWrapper>
    </Container>
  );
}

const Content = styled.div`
  width: 700px;
  height: 600px;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

const KatexText = styled.span`
  font-family: KaTeX_Main, sans-serif;
`;

export default FinalChart;
