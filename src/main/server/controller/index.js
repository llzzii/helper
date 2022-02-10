const fs = require('fs')
const Store = require('electron-store')
const exec = require('child_process').exec
const path = require('path')
const atob = require('atob')
const shell = require('shelljs')
let timer = null
/**
 * @description 获取工具配置
 * @param {*} req
 * @param {*} res
 */
export const getSetting = (req, res) => {
  const store = new Store()
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
  const newData = req.body
  // cmd /c D:\linux\xshell\Xshell.exe ssh://root:root@172.16.4.65:22
  // {putty路径}  putty -ssh {username}@{hostIP} -P {hostPort} -pw {password}
  const store = new Store()
  const setting = store.get('setting')
  if (setting == null) {
    res.send({ code: 293.998001, msg: '请先在小助手中配置客户端信息', data: setting })
  }
  let cmdStr, pwd
  pwd = newData.pwd
  pwd = decodeURIComponent(atob(pwd)).slice(2, -1)
  console.log(pwd)
  if (
    (req.body.toolType === 'xshell' && setting.xshellClientPath === '') ||
    (req.body.toolType === 'putty' && setting.puTTYClientPath === '') ||
    (req.body.toolType === 'SecureCRT' && setting.secureCRTClientPath === '')
  ) {
    res.send({ code: 293.998002, msg: `请先在小助手中配置${req.body.toolType}客户端地址`, data: setting })
    return
  }
  if (req.body.toolType === 'xshell') {
    cmdStr = `cmd /c "${setting.xshellClientPath}"  -url ssh://${newData.user}${pwd && pwd !== '' ? ':' + pwd : ''}@${newData.host}:${newData.port} -newtab icb`
  }
  if (req.body.toolType === 'putty') {
    cmdStr = `cmd /c "${setting.puTTYClientPath}" -ssh ${newData.user}@${newData.host} -P ${newData.port}  ${pwd && pwd !== '' ? '-pw ' + pwd : ''}`
  }
  //  /T /N {tabName}  /SSH2 /P {hostPort} /PASSWORD {password} {user_name}@{hostIP}
  if (req.body.toolType === 'SecureCRT') {
    cmdStr = `cmd /c "${setting.secureCRTClientPath}" /T /N icb  /SSH2 /P  ${newData.port} ${pwd && pwd !== '' ? ' /PASSWORD ' + pwd : ''}   ${newData.user}@${newData.host} `
  }
  console.log(cmdStr)

  //   exec(cmdStr, { timeout: 10000 }, function(err, stdout, stderr) {
  //     console.log(123)
  //     clearTimeout(timer)
  //     if (err) {
  //       console.log(err)
  //       res.send({ code: 293.998003, msg: '执行命令失败', data: stderr })
  //     } else {
  //       res.send({ code: 200, msg: '执行命令成功', data: stdout })
  //     }
  //     res.end()
  //   })
  shell.exec(cmdStr, function(code, stdout, stderr) {
    clearTimeout(timer)

    try {
      if (code === 0) {
        res.send({ code: 200, msg: '执行命令成功' })
        // do something
      } else {
        res.send({ code: 293.998003, msg: '执行命令失败' })
      }
      res.end()
    } catch (error) {
      console.log(error)
    }
  })
  timer = setTimeout(() => {
    try {
      res.send({ code: 200, msg: '执行命令成功' })
      res.end()
    } catch (error) {
      console.log(error)
    }

    timer = null
  }, 50000)
}
