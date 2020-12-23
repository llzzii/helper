import express from 'express'
import { getSetting, openTool } from '../controller/index'
//实例化路由
let router = express.Router()
//所有关于user的接口就写在这个js文件里
router.get('/setting', getSetting)
router.post('/openTool', openTool)
export default router
