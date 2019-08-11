import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import last from 'lodash/last';

import { simpleReducer } from 'utils/common';
import { PageNumbers } from 'constants/common';

import { WizardProvider } from './Wizard.context';

function Wizard({ components, initialValues, title }) {
  const [steps, setSteps] = useState([
    PageNumbers.CONCENTRATION_CALCULATION_WAY_SELECTION,
  ]);
  const [state, dispatch] = useReducer(simpleReducer, initialValues);

  useEffect(() => dispatch(initialValues), [initialValues]);

  const nextStep = useCallback(
    () => setSteps(prevSteps => [...prevSteps, last(prevSteps) + 1]),
    [],
  );
  const previousStep = useCallback(
    () => setSteps(prevSteps => prevSteps.slice(0, -1)),
    [],
  );

  const setStep = useCallback(
    step => setSteps(prevSteps => [...prevSteps, step]),
    [],
  );

  const updateState = useCallback(data => dispatch(data), [dispatch]);

  const context = useMemo(
    () => ({
      setStep,
      nextStep,
      previousStep,
      updateState,
      state,
    }),
    [nextStep, previousStep, setStep, state, updateState],
  );

  const Page = components[last(steps)];
  return (
    <WizardProvider value={context}>
      <Page title={title} />
    </WizardProvider>
  );
}

export default Wizard;
