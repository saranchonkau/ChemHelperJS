import React, { useReducer } from 'react';
import styled from 'styled-components';

import { RadioGroup, Radio } from '@material-ui/core';
import { FormLabel, FormControl, FormControlLabel } from '@material-ui/core';

import { simpleReducer } from 'utils/common';
import { ConcentrationCalculationWays } from 'constants/common';

import NextButton from 'components/NextButton';
import { useWizardContext } from 'components/Wizard';

import Container from '../Container';
import Title from '../Title';
import ContentWrapper from '../ContentWrapper';

const OPTIONS = [
  {
    id: 1,
    value: ConcentrationCalculationWays.OWN_WAY,
    label: 'Enter own values',
  },
  {
    id: 2,
    value: ConcentrationCalculationWays.MOLAR_ATTENUATION_COEFFICIENT_WAY,
    label: 'Calculate with molar extinction coefficient',
  },
  {
    id: 3,
    value: ConcentrationCalculationWays.CALIBRATION_TABLE_WAY,
    label: 'Calculate with calibration table',
  },
];

function CalculationWaySelection({ title }) {
  const { setStep, updateState, state } = useWizardContext();

  const [data, dispatch] = useReducer(simpleReducer, {
    calculationWay: state.calculationWay,
  });

  function handleChange(event, value) {
    dispatch({ calculationWay: value });
  }

  function nextPage() {
    updateState(data);
    setStep(Number.parseInt(data.calculationWay, 10));
  }

  return (
    <Container>
      <Title>{title}</Title>
      <ContentWrapper>
        <Content>
          <Form>
            <StyledFormControl component="fieldset">
              <StyledFormLabel component="legend">
                Choose way of concentration calculation:
              </StyledFormLabel>
              <StyledRadioGroup
                name="calculationWay"
                value={data.calculationWay}
                onChange={handleChange}
              >
                {OPTIONS.map(option => (
                  <StyledFormControlLabel
                    key={option.id}
                    value={option.value}
                    control={<StyledRadio />}
                    label={option.label}
                  />
                ))}
              </StyledRadioGroup>
            </StyledFormControl>
          </Form>
          <Footer>
            <NextButton onClick={nextPage} />
          </Footer>
        </Content>
      </ContentWrapper>
    </Container>
  );
}

const StyledFormControl = styled(FormControl)`
  margin: 24px;
`;

const Content = styled.div`
  width: 540px;
`;

const Form = styled.form`
  display: flex;
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin: 4px 0;
`;
const StyledFormLabel = styled(props => (
  <FormLabel {...props} classes={{ root: 'root', focused: 'root' }} />
))`
  &.root {
    color: rgb(33, 37, 41);
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
`;

const StyledFormControlLabel = styled(props => (
  <FormControlLabel {...props} classes={{ label: 'label' }} />
))`
  .label {
    font-size: 1.1rem;
  }
`;

const StyledRadio = styled(props => (
  <Radio {...props} classes={{ checked: 'checked' }} />
))`
  &.checked {
    color: #25bf75;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default CalculationWaySelection;
