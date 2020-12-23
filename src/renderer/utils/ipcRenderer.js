import { ipcRenderer } from 'electron'

export default {
  send(data, arg, cb) {
    ipcRenderer.send(data, arg, (event, arg) => cb(event, arg))
  },
  on(data, arg, cb) {
    ipcRenderer.on(data, arg, (event, arg) => cb(event, arg))
  },
  remove(data) {
    ipcRenderer.removeAllListeners(data)
  },
}
