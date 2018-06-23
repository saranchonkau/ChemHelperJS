import React from 'react';
import Header from "../Header";
import FormulaList from "../FormulaList";
import Yield from "../Yield";
import QuantumYield from "../QuantumYield";
import DoseRate from "../DoseRate";
import {Route, Switch} from "react-router-dom";

const FormulaPage = () => (
    <React.Fragment>
        <Header/>
        <div className='d-flex'>
            <FormulaList/>
                <Switch>
                    <Route exact path='/formula' component={() => <div/>}/>
                    <Route exact path='/formula/yield' component={Yield}/>
                    <Route exact path='/formula/doseRate' component={DoseRate}/>
                    <Route exact path='/formula/quantumYield' component={QuantumYield}/>
                </Switch>
        </div>
    </React.Fragment>
);

export default FormulaPage;