const roomModel = require('../../models/room');
const chatModel = require('../../models/chat');

const util = require('../../library/util');

exports.join = async (wss, ws, message) => {
    const type = message.type;
    const userNo = ws.decoded.no;
    const roomNo = message.no;
    try {
        const roomRes = await roomModel.findsByNo(userNo);
        const isJoined = roomRes.data.some(data => data.no === roomNo);
        if (!isJoined) {
            util.wsSend(ws, { status: 401 });
            return;
        }
        ws.room = roomNo;
        const chats = await chatModel.findsByRoomNo(roomNo);
        wss.clients.forEach(client => {
            const { decoded } = client;
            if (!decoded) return;
            if (decoded.no === userNo) {
                util.wsSend(client, { type, data: { chats } });
                return;
            } else if (client.room === roomNo) {
                util.wsSend(client, { type: 'JOINED', data: { room: roomNo, name: ws.decoded.name } });
                return;
            }
        });
    } catch (error) {
        util.wsSend(ws, { status: 500 });
    }
};

exports.send = async (wss, ws, message) => {
    const type = message.type;
    const chat = {
        name: ws.decoded.name,
        content: message.content,
        room: ws.room,
    };
    
    try {
        await chatModel.create(chat);
        const result = {
            type,
            data: {
                content: message.content,
                name: ws.decoded.name,
            }
        };
        wss.clients.forEach(client => {
            if (client.room === ws.room) {
                util.wsSend(client, result);
            }
        });
    } catch (error) {
        util.wsSend(ws, { status: 500 });
    }
};

exports.invite = async (wss, ws, message) => {
    const type = message.type;
    const invitedUserNo = message.no;
    const roomNo = ws.room;
    const { id } = ws.decoded;

    try {
        if (typeof roomNo === 'undefined') throw new Error();
        const roomRes = await roomModel.findNameByNo(roomNo);
        const result = {
            type,
            data: {
                no: roomNo,
                name: roomRes.name,
                id,
            },
        };
        wss.clients.forEach(client => {
            const { decoded } = client;
            if (!decoded) return;
            if (decoded.no === invitedUserNo) {
                util.wsSend(client, result);
            }
        });
    } catch (error) {
        util.wsSend(ws, { status: 500 });
    }
};