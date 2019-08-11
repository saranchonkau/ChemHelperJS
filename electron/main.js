const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const url = require('url');
const queries = require('./db/queries');
const excel = require('./excel/excel');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window;

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.resolve(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  console.log('START_URL: ', startUrl);
  window.loadURL(startUrl);

  // Emitted when the window is closed.
  window.on('closed', () => {
    window = null;
  });
}

ipcMain.on('executeQuery', (event, query) => {
  queries
    .executeQuery(query)
    .then(result => event.sender.send('queryResponse', result));
});

ipcMain.on('countAll', (event, query) => {
  queries
    .executeQuery(query)
    .then(result => event.sender.send('countAll', result));
});

/*
ipcMain.on('exportTableDataOnly', (event, data) => {
    excel.exportTableDataOnly({ mainWindow: win, data });
});

ipcMain.on('exportTableDataWithCharts', (event, data) => {
    excel.exportTableDataWithCharts({ mainWindow: win, data });
});
*/

ipcMain.on('saveExcelPattern', (event, type) => {
  excel.savePattern({ mainWindow: window, type });
});

ipcMain.on('copyToClipboard', (event, text) => {
  clipboard.writeText(text);
});

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});
