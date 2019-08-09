import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

import { getTrendResult, suggestMaxValue, suggestMinValue } from 'utils/utils';
import { chartOptions, datasets } from 'utils/charts';
import { createQuantumYieldTSVFile } from 'utils/excel/quantumYield';
import { calculateQuantumYield } from 'utils/calculations';

import { ExcelPatternTypes } from 'constants/common';

import BackButton from 'components/BackButton';
import SavePatternButton from 'components/SavePatternButton';
import CopyButton from 'components/CopyButton';
import { useWizardContext } from 'components/Wizard';
import LineEquation from 'components/LineEquation';
import RSquaredEquation from 'components/RSquaredEquation';
import CalculationResult from 'components/CalculationResult';

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

  const quantumYield = calculateQuantumYield({
    slope: result.slope,
    volume: state.volume,
    lightIntensity: state.lightIntensity,
  });

  const confidenceInterval = result.slopeConfidenceInterval
    ? calculateQuantumYield({
        slope: result.slopeConfidenceInterval,
        volume: state.volume,
        lightIntensity: state.lightIntensity,
      })
    : 0;

  const trendData = selectedData.map(point => ({
    x: point.x,
    y: result.predictY(point.x), // Trend function
  }));

  const exportData = {
    volume: state.volume,
    lightIntensity: state.lightIntensity,
    finalData: data.filter(point => point.isSelected),
    quantumYield,
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

  const tsvFile = createQuantumYieldTSVFile({ data: exportData });

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
            name="Quantum Yield"
            value={quantumYield}
            error={confidenceInterval}
          />
          <Footer>
            <BackButton onClick={previousStep} />
            <CopyButton text={tsvFile} />
            <SavePatternButton patternType={ExcelPatternTypes.QUANTUM_YIELD} />
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
  font-family: KaTeX_Math, sans-serif;
`;

export default FinalChart;
