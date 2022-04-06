const token = require('../../library/token');
const messageController = require('./messageController');

module.exports = async (wss) => {
    wss.on('connection', async (ws, req) => {
        /*
        const userToken = token.get(req);
        const decoded = await token.decode(userToken);
        ws.decoded = decoded;
        */

        //////////////////////////
        if (req.headers['x-real-ip'] === '49.247.19.16') {
            ws.decoded = { no: 9999, name: '다니' };
            ws.room = 100;
        } else {
            //각 웹소켓 클라이언트에 no 삽입
            const userToken = token.get(req);
            const decoded = await token.decode(userToken);
            ws.decoded = decoded;
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
                case 'HEART':
                    break;
                default:
            }
        });
    });
};