import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

import { suggestMaxValue, suggestMinValue } from 'utils/common';
import { chartOptions, datasets } from 'utils/charts';
import { createYieldTSVFile } from 'utils/excel/radChemYield';
import { calculateYield, getTrendResult } from 'utils/calculations';

import { ExcelPatternTypes } from 'constants/common';

import BackButton from 'components/BackButton';
import CopyButton from 'components/CopyButton';
import SavePatternButton from 'components/SavePatternButton';
import { useWizardContext } from 'components/Wizard';
import LineEquation from 'components/LineEquation';
import RSquaredEquation from 'components/RSquaredEquation';
import CalculationResult from 'components/CalculationResult';

import Container from '../Container';
import Subtitle from '../Subtitle';
import Title from '../Title';
import ContentWrapper from '../ContentWrapper';

function FinalChart({ title }) {
  const { previousStep, state } = useWizardContext();

  const data = state.finalData.map(point => ({
    ...point,
    dose: state.doseRate * 60 * point.time,
  }));

  const selectedData = data
    .filter(point => point.isSelected)
    .map(data => ({ x: data.dose, y: data.concentration }));

  const unselectedData = data
    .filter(point => !point.isSelected)
    .map(data => ({ x: data.dose, y: data.concentration }));

  const result = getTrendResult(selectedData);

  const radYield = calculateYield({
    slope: result.slope,
    density: state.solutionDensity,
    unit: state.unit,
  });

  const confidenceInterval = result.slopeConfidenceInterval
    ? calculateYield({
        slope: result.slopeConfidenceInterval,
        density: state.solutionDensity,
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
    yield: radYield,
    confidenceInterval,
  };

  const xArray = data.map(point => point.dose);

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
        `Absorbed dose: ${tooltipItem.xLabel} Gray`,
      ],
      xLabel: 'Absorbed dose, Gray',
      yLabel: 'Concentration, M',
      xTicksMin: suggestMinValue(xArray),
      xTicksMax: suggestMaxValue(xArray),
    }),
    redraw: true,
  };

  const tsvFile = createYieldTSVFile({ data: exportData });
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
            name="Yield"
            value={radYield}
            error={confidenceInterval}
            unit={state.unit}
          />
          <Footer>
            <BackButton onClick={previousStep} />
            <CopyButton text={tsvFile} />
            <SavePatternButton patternType={ExcelPatternTypes.RAD_CHEM_YIELD} />
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
