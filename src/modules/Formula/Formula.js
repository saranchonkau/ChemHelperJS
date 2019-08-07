import React from 'react';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import Header from 'components/Header';

import FormulaList from './components/FormulaList';
import RadiationYield from './components/RadiationYield';
import QuantumYield from './components/QuantumYield';
import DoseRate from './components/DoseRate';

const Formula = () => (
  <>
    <Header />
    <Content>
      <FormulaList />
      <Switch>
        <Route exact path="/formula" component={() => <div />} />
        <Route exact path="/formula/yield" component={RadiationYield} />
        <Route exact path="/formula/doseRate" component={DoseRate} />
        <Route exact path="/formula/quantumYield" component={QuantumYield} />
      </Switch>
    </Content>
  </>
);

const Content = styled.div`
  display: flex;
`;

export default Formula;
