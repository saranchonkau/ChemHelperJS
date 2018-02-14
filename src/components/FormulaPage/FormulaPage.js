import React from 'react';
import Header from "../Header";
import FormulaList from "../FormulaList";
import Wizard from "../Yield/Wizard";
import history from "../../history";
import {Router, HashRouter, Route, Switch} from "react-router-dom";

const FormulaPage = () => (
    <React.Fragment>
        <Header/>
        <div className='d-flex'>
            <FormulaList/>
            {/*<Router history={history}>*/}
            <HashRouter>
                <Switch>
                    <Route exact path='/formula' component={
                        () => (<h3>Click on 'Radiation chemistry => Radiation chemistry yield'</h3>)
                    }/>
                    <Route exact path='/formula/yield' component={Wizard}/>
                </Switch>
            </HashRouter>
            {/*</Router>*/}
        </div>
    </React.Fragment>
);

export default FormulaPage;