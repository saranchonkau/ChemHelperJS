import React from 'react';
import Header from "../Header";
import FormulaList from "../FormulaList";
import Yield from "../Yield/Wizard";
import DoseRate from "../DoseRate/Wizard";
import history from "../../history";
import {Router, HashRouter, Route, Switch} from "react-router-dom";

const FormulaPage = () => (
    <React.Fragment>
        <Header/>
        <div className='d-flex'>
            <FormulaList/>
                <Switch>
                    <Route exact path='/formula'
                           component={() => <h3>Click on left list :)</h3>}
                    />
                    <Route exact path='/formula/yield' component={Yield}/>
                    <Route exact path='/formula/doseRate' component={DoseRate}/>
                </Switch>
        </div>
    </React.Fragment>
);

export default FormulaPage;