const express = require('express')
const request = require('request')
const path = require('path')
const cookieParser = require('cookie-parser')
//http ws 동시 사용을 위한 server http 분리 처리
const http = require('http')
const webSocketServer = require('./websocket')

//익스프레스 기본 셋팅
const app = express()
const port = 9000
const server = http.createServer(app)

//webSocket 서버 실행
webSocketServer(server)

//바디 파싱
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//쿠키 파싱
app.use(cookieParser())


//jwt config 임포트
const jwtConfig = require('./config/jwt_config')
app.set('jwt-secret', jwtConfig.secretKey)
//api 라우터 임포트
app.use('/', require('./api'))

app.use((req, res, next) => {
	res.status(404).send('잘못된 접근입니다.')
});

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('서버 에러')
});

server.listen(port, () => {
	console.log('express websocket integration server start')
})
//mongodb 연결
const mongoose = require('mongoose')
const conf = require('./config/db_config')
mongoose.Promise = global.Promise

mongoose.connect(conf.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Successfully connected to mongodb'))
.catch(e => console.log(e))
