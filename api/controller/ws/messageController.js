const roomModel = require('../../models/room');
const chatModel = require('../../models/chat');

exports.join = async (wss, ws, message) => {
    const type = message.type;
    const userNo = ws.decoded.no;
    const roomNo = message.no;
    try {
        const roomRes = await roomModel.findsByNo(userNo);
        const isJoined = roomRes.data.some(data => data.no === roomNo);
        if (!isJoined) {
            ws._send({ status: 401 });
            return;
        }
        if (ws.room && ws.room !== roomNo) {
            wss.clients.forEach(client => {
                if (client.room !== ws.room) {
                    return;
                }
                client._send({ type: 'EXIT', data: { room: roomNo, user: { id: ws.decoded.id, name: ws.decoded.name } } });
            });
        }
        ws.room = roomNo;
        const chats = await chatModel.findsByRoomNo(roomNo);
        const joinedMsg = { type, data: { chats, room: roomNo, users: [{ id: ws.decoded.id, name: ws.decoded.name }] } };
        wss.clients.forEach(client => {
            if (!client.decoded) return;
            if (client.decoded.no === ws.decoded.no) return;
            if (client.room === roomNo) {
                client._send({ type: 'ENTER', data: { room: roomNo, user: { id: ws.decoded.id, name: ws.decoded.name } } });
                joinedMsg.data.users.push({ id: client.decoded.id, name: client.decoded.name});
                return;
            }
        });
        ws._send(joinedMsg);
    } catch (error) {
        ws._send({ status: 500 });
    }
};

exports.send = async (wss, ws, message) => {
    const type = message.type;
    const chat = {
        id: ws.decoded.id,
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
                id: ws.decoded.id,
            }
        };
        wss.clients.forEach(client => {
            if (client.room === ws.room) {
                client._send(result);
            }
        });
    } catch (error) {
        ws._send({ status: 500 });
    }
};

exports.invite = async (wss, ws, message) => {
    const type = message.type;
    const invitedUserNo = message.no;
    const roomNo = ws.room;
    const { id } = ws.decoded;

    try {
        if (typeof roomNo === 'undefined') throw new Error();
        const { status, data } = await roomModel.findNameByNo(roomNo);
        if (!data) throw new Error();
        const result = {
            type,
            data: {
                no: roomNo,
                name: data.name,
                id,
            },
        };
        wss.clients.forEach(client => {
            const { decoded } = client;
            if (!decoded) return;
            if (decoded.no === invitedUserNo) {
                client._send(result);
            }
        });
    } catch (error) {
        ws._send({ status: 500 });
    }
};

exports.exit = (wss, ws) => {
    if (!ws.room) return;
    wss.clients.forEach(client => {
        console.log(client.decoded);
        if (ws.decoded.no === client.decoded.no) return;
        if (!client.room || ws.room !== client.room) return;
        console.log(client.room);
        client._send({ type: 'EXIT', data: { room: ws.room, user: { id: ws.decoded.id, name: ws.decoded.name } } });
    });
    delete ws.room;
};

exports.roomEnter = async (wss, ws, message) => {
    const roomNo = message.no;
    const { id, name } = ws.decoded;

    try {
        if (typeof roomNo === 'undefined') throw new Error();

        const chat = {
            id,
            name,
            type: 'ENTER',
            room: roomNo,
        };
        await chatModel.create(chat);

        wss.clients.forEach(client => {
            const { decoded } = client;
            if (!decoded) return;
            if (client.room !== roomNo) return;
            client._send({ type: 'SEND', data: { type: 'ENTER', id, name } });
        });
    } catch (error) {
        ws._send({ status: 500 });
    }
}

exports.roomExit = async (wss, ws, message) => {
    const roomNo = message.no;
    const { id, name } = ws.decoded;

    try {
        if (typeof roomNo === 'undefined') throw new Error();

        const chat = {
            id,
            name,
            type: 'EXIT',
            room: roomNo,
        };
        await chatModel.create(chat);

        wss.clients.forEach(client => {
            const { decoded } = client;
            if (!decoded) return;
            if (client.room !== roomNo) return;
            client._send({ type: 'SEND', data: { type: 'EXIT', id, name } });
        });
    } catch (error) {
        console.log(error);
        ws._send({ status: 500 });
    }
}