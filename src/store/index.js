import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import appReducer from "../reducers";
import { routerMiddleware } from "react-router-redux";
import history from "../history";
const historyMiddleware = routerMiddleware(history);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    appReducer,
    composeEnhancers(
        applyMiddleware(thunk, historyMiddleware)
    )
);
export default store;