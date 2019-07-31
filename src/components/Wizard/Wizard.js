import React, { useCallback, useMemo, useReducer, useState } from 'react';
import { WizardProvider } from './Wizard.context';
import { simpleReducer } from 'utils/utils';

function Wizard({ components, initialValues, title }) {
  const [step, setStep] = useState(0);
  const [state, dispatch] = useReducer(simpleReducer, initialValues);

  const nextStep = useCallback(() => setStep(prevStep => prevStep + 1), [
    setStep,
  ]);
  const previousStep = useCallback(() => setStep(prevStep => prevStep - 1), [
    setStep,
  ]);

  const updateState = useCallback(data => dispatch(data), [dispatch]);

  const context = useMemo(
    () => ({
      setStep,
      nextStep,
      previousStep,
      updateState,
      state,
    }),
    [],
  );

  const Page = components[step];
  return (
    <WizardProvider value={context}>
      <Page title={title} />
    </WizardProvider>
  );
}

export default Wizard;
