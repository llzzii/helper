import express from 'express'
import router from './routes/index'
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//设置跨域访问
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('X-Powered-By', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  res.header('Access-Control-Allow-Credentials', true) //携带cookie跨域请求
  req.method.toUpperCase() === 'OPTIONS' ? res.sendStatus(200) : next() //防止在预请求阶段就响应接口
})

app.get('/message', (req, res) => {
  res.send('这是来自node服务端的信息')
})

app.use(router)
app.post('/message', (req, res) => {
  if (req) {
    res.send(req + '--来自node')
  }
})
export default app
