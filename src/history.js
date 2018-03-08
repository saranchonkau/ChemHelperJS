import { createBrowserHistory, createHashHistory } from 'history';

let history;

if (process.env.ELECTRON_START_URL) {
    history = createBrowserHistory();
} else {
    history = createHashHistory();
}

export default history;