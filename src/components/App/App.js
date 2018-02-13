import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, HashRouter, Route, Switch } from 'react-router-dom';
import history from '../../history';
import Main from '../Main';
import Yield from '../Yield';

const App = ({ store }) => (
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route exact path='/formula/yield' component={Yield}/>
                <Route exact path='/' component={Main}/>
            </Switch>
        </Router>
    </Provider>
);
// const App = ({ store }) => (
//     <Provider store={store}>
//         <HashRouter>
//             <Switch>
//                 <Route exact path='/formula/yield' component={Yield}/>
//                 <Route exact path='/' component={Main}/>
//             </Switch>
//         </HashRouter>
//     </Provider>
// );
App.propTypes = {
    store: PropTypes.object.isRequired
};
export default App;