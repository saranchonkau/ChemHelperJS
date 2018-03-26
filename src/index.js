import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import 'typeface-roboto';
import './components/App/App.css';
import './components/App/table.css';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';

ReactDOM.render(
    <App store={store}/>,
    document.getElementById('root')
);
registerServiceWorker();