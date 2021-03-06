const express = require('express')
const request = require('request')
const path = require('path')
const cookieParser = require('cookie-parser')
//http ws 동시 사용을 위한 server http 분리 처리
const http = require('http')

const appController = require('./controller');
//ws
const webSocket = require('ws')
const wsMiddleware = require('./middlewares/wsMiddleware');
const wsController = require('./controller/ws');

//익스프레스 기본 셋팅
const app = express()
const port = 9000
const server = http.createServer(app)

const cors = require('cors');

//webSocket 서버 실행
const webSocketServer = new webSocket.Server({server});
server.on('upgrade', wsMiddleware);
wsController(webSocketServer);

//cors
app.use(cors({
    origin: ['https://mt.zodaland.com', 'https://mt.test.zodaland.com'],
    credentials: true,
}));
//바디 파싱
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//쿠키 파싱
app.use(cookieParser())

//api 라우터 임포트
app.use('/', appController);

app.use((req, res, next) => {
	res.status(404).send('잘못된 접근입니다.')
});

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('서버 에러')
});

if (process.env.NODE_ENV !== 'test') {
	server.listen(port, () => {
		console.log('express websocket integration server start')
	})
}
const mongoose = require('./library/mongodb');
mongoose.connect();

module.exports = app;
