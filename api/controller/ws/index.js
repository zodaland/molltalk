const token = require('../../library/token');
const messageController = require('./messageController');
const logger = require('../../library/log');

module.exports = async (wss) => {
    wss.on('connection', async (ws, req) => {
        /*
        const userToken = token.get(req);
        const decoded = await token.decode(userToken);
        ws.decoded = decoded;
        */

        //////////////////////////
        try {
            if (req.headers['x-real-ip'] === '49.247.19.16') {
                ws.decoded = { no: 9999, name: '다니', id: 'superzodaland' };
                ws.room = 100;
                wss.clients.forEach(client => {
                    if (client.room !== ws.room) return;
                    if (client.decoded.no === ws.decoded.no) return;
                    client._send({ type: 'ENTER', data: { room: ws.room, user: { name: ws.decoded.name, id: ws.decoded.id } } });
                });
            } else {
                //각 웹소켓 클라이언트에 no 삽입
                const userToken = token.get(req);
                const decoded = await token.decode(userToken);
                ws.decoded = decoded;
            }
        } catch (error) {
            logger.error(error);
        }
        ws._send = function(msg) {
            this.send(JSON.stringify(msg));
        }
        //////////////////////////
        ws.on('message', (message) => {
            //const data = JSON.parse(message);
            /////////////////
            let data = {};
            
            if (ws.decoded.no === 9999) {
                data.type = 'SEND';
                data.content = message;
            } else {
                data = JSON.parse(message);
            }
            /////////////////

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
        });
        ws.on('close', () => messageController.exit(wss, ws));
    });
};
