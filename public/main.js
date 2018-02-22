const {app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const queries = require("./db/queries");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            preload: __dirname + '/preload.js'
        }
    });

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    win.loadURL(startUrl);


    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null
    })
}

ipcMain.on('executeQuery', (event, query) => {
    queries.executeQuery(query)
        .then(result => event.sender.send('queryResponse', result));
    }
);

ipcMain.on('countAll', (event, query) => {
    queries.executeQuery(query)
        .then(result => event.sender.send('countAll', result));
});

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});