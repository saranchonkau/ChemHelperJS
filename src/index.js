import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'font-awesome/css/font-awesome.min.css';
import 'typeface-roboto';
import 'assets/styles/globalStyles.css';
import 'assets/styles/normalize.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
