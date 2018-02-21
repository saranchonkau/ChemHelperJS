import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, HashRouter, Route, Switch } from 'react-router-dom';
import history from '../../history';
import Main from '../Main';
import FormulaPage from '../FormulaPage';
import Nuclides from "../Nuclides";

// const App = ({ store }) => (
//     <Provider store={store}>
//         <HashRouter>
//             <Switch>
//                 <Route path='/formula' component={FormulaPage}/>
//                 <Route exact path='/' component={Main}/>
//             </Switch>
//         </HashRouter>
//     </Provider>
// );
const App = ({ store }) => (
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route path='/nuclides' component={Nuclides}/>
                <Route path='/formula' component={FormulaPage}/>
                <Route exact path='/' component={Main}/>
            </Switch>
        </Router>
    </Provider>
);

App.propTypes = {
    store: PropTypes.object.isRequired
};

export default App;