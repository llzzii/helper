const fs = require('fs')
const Store = require('electron-store')
const exec = require('child_process').exec
const path = require('path')
const atob = require('atob')

/**
 * @description 获取工具配置
 * @param {*} req
 * @param {*} res
 */
export const getSetting = (req, res) => {
  let store = new Store()
  console.log(store.get('setting'))
  res.send({ data: store.get('setting') })
}

/**
 * req.body={
 * toolType:xshell/putty/secureCRT,
 * user:root,
 * host:127.0.0.1,
 * port:22,
  pwd:"Lc13yfwpW"
 * 
 * }
 * @description cmd 打开本地工具
 * @param {*} req
 * @param {*} res
 */
export const openTool = (req, res) => {
  let newData = req.body
  // cmd /c D:\linux\xshell\Xshell.exe ssh://root:root@172.16.4.65:22
  // {putty路径}  putty -ssh {username}@{hostIP} -P {hostPort} -pw {password}
  let store = new Store()
  let setting = store.get('setting')
  if (setting == null) {
    res.send({ code: -1, msg: '请先在小助手中配置客户端信息', data: setting })
  }
  let cmdStr, pwd
  pwd = newData['pwd']
  pwd = atob(pwd).slice(2, -1)
  console.log(pwd)
  if (
    (req.body['toolType'] === 'xshell' && setting['xshellClientPath'] === '') ||
    (req.body['toolType'] === 'puTTY' && setting['puTTYClientPath'] === '') ||
    (req.body['toolType'] === 'secureCRT' && setting['secureCRTClientPath'] === '')
  ) {
    res.send({ code: -2, msg: `请先在小助手中配置${req.body['toolType']}客户端地址`, data: setting })
    return
  }
  if (req.body['toolType'] === 'xshell') {
    cmdStr = `cmd /c "${setting['xshellClientPath']}"  -url ssh://${newData['user']}${pwd && pwd !== '' ? ':' + pwd : ''}@${
      newData['host']
    }:${newData['port']} -newtab icb`
  }
  if (req.body['toolType'] === 'putty') {
    cmdStr = `cmd /c "${setting['puTTYClientPath']}" -ssh ${newData['user']}@${newData['host']} -P ${newData['port']}  ${
      pwd && pwd !== '' ? '-pw ' + pwd : ''
    }`
  }
  //  /T /N {tabName}  /SSH2 /P {hostPort} /PASSWORD {password} {user_name}@{hostIP}
  if (req.body['toolType'] === 'secureCRT') {
    cmdStr = `cmd /c "${setting['secureCRTClientPath']}" /T /N icb  /SSH2 /P  ${newData['port']} ${
      pwd && pwd !== '' ? ' /PASSWORD ' + pwd : ''
    }   ${newData['user']}@${newData['host']} `
  }
  console.log(cmdStr)
  exec(cmdStr, function(err, stdout, stderr) {
    if (err) {
      res.send({ code: -4, msg: '执行命令失败', data: err })
    } else {
      res.send({ code: 200, msg: '执行命令成功', data: stdout })
    }
  })
}
