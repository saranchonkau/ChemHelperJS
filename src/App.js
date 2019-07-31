import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from './history';
import Formula from 'modules/Formula';
import MaterialProvider from 'components/Material';
// import Nuclides from 'modules/Nuclides';
import store from './store';

function App() {
  return (
    <MaterialProvider>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            {/*<Route path="/nuclides" component={Nuclides} />*/}
            <Route path="/formula" component={Formula} />
            <Redirect from={'/'} to={'/formula'} />
          </Switch>
        </Router>
      </Provider>
    </MaterialProvider>
  );
}

export default App;
