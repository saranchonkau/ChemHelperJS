import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from './history';
import Formula from 'modules/Formula';
import MaterialProvider from 'components/Material';
import Nuclides from 'modules/Nuclides';

function App() {
  return (
    <MaterialProvider>
      <Router history={history}>
        <Switch>
          <Route path="/nuclides" component={Nuclides} />
          <Route path="/formula" component={Formula} />
          <Redirect from={'/'} to={'/formula'} />
        </Switch>
      </Router>
    </MaterialProvider>
  );
}

export default App;
