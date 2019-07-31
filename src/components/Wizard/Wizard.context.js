import React, { useContext } from 'react';

const WizardContext = React.createContext(null);

export function useWizardContext() {
  return useContext(WizardContext);
}

export function WizardProvider({ value, children }) {
  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}
