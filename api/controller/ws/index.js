const token = require('../../library/token');
const messageController = require('./messageController');
const logger = require('../../library/log');

module.exports = async (wss) => {
    wss.on('connection', async (ws, req) => {
        /* ws send custom function */
        ws._send = function(msg) {
            this.send(JSON.stringify(msg));
        }

        /* 웹소켓 접속 유저 전처리 */
        try {
            //각 웹소켓 클라이언트에 no 삽입
            const userToken = token.get(req);
            //토큰이 없을 경우 ssh 로그인 체크
            if (!userToken) {
                ws.ip = req.headers['x-real-ip'];
                ws.isSSHUser = true;
                messageController.checkSSHId(ws);
            } else {
                const decoded = await token.decode(userToken);
                ws.decoded = decoded;
                ws.isSSHUser = false;
            }
        } catch (error) {
            logger.error(error);
        }

        /* 메시지 입력 후 처리*/
        ws.on('message', async (message) => {
            if (!ws.isSSHUser) {
                let data = {};

                try {
                    data = JSON.parse(message);
                } catch (error) {
                    return;
                }
                const { type } = data;
                switch (type) {
                    case 'JOIN':
                        messageController.join(wss, ws, data);
                        break;
                    case 'SEND':
                        messageController.send(wss, ws, data);
                        break;
                    case 'INVITE':
                        messageController.invite(wss, ws, data);
                        break;
                    case 'EXIT':
                        messageController.exit(wss, ws);
                        break;
                    case 'ROOMENTER':
                        messageController.roomEnter(wss, ws, data);
                        break;
                    case 'ROOMEXIT':
                        messageController.roomExit(wss, ws, data);
                        break;
                    case 'HEART':
                        if (data.no && !ws.room) messageController.join(wss, ws, data);
                        break;
                    default:
                }
            } else {
                if (!ws.id && !ws.decoded) {
                    messageController.checkSSHPassword(ws, message);
                } else if (!ws.decoded) {
                    //로그인 체크 후 접속 유지 처리
                    messageController.checkSSHLogin(ws, message)
                    .then(isLogin => isLogin && setInterval(() => ws.ping(() => {}), 10000));
                } else if (!ws.room) {
                    messageController.checkSSHRoom(wss, ws, message);
                } else {
                    data = { type: 'SEND', content: message };
                    messageController.send(wss, ws, data);
                }
            }
        });

        /* 접속 해제 처리 */
        ws.on('close', () => messageController.exit(wss, ws));

        /* ssh 유저 접속 유지 처리 */
        ws.on('pong', () => {});
    });
};
