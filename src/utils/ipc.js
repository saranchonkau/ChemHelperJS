import isElectron from 'is-electron';

export function sendMessage(name, value) {
  if (isElectron()) {
    window.ipcRenderer.send(name, value);
  }
}
