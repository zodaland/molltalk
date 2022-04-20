const roomModel = require('../../models/room');
const chatModel = require('../../models/chat');
const authModel = require('../../models/auth');
const roomUserModel = require('../../models/roomUser');

const join = async (wss, ws, message) => {
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
        //HEART 메시지로 인한 방 번호 입력시 여기서 리턴
        if (message.type !== 'JOIN') return;
        const chats = await chatModel.findsByRoomNo(roomNo);
        const joinedMsg = { type: 'JOIN', data: { chats, room: roomNo, users: [{ id: ws.decoded.id, name: ws.decoded.name }] } };
        wss.clients.forEach(client => {
            if (!client.decoded) return;
            if (client.decoded.no === ws.decoded.no) return;
            if (client.room === roomNo) {
                if (client.isSSHUser) client._send(`${ws.decoded.id}님이 접속했습니다.`);
                else client._send({ type: 'ENTER', data: { room: roomNo, user: { id: ws.decoded.id, name: ws.decoded.name } } });
                joinedMsg.data.users.push({ id: client.decoded.id, name: client.decoded.name});
                return;
            }
        });
        if (!ws.isSSHUser) ws._send(joinedMsg);
    } catch (error) {
        if (ws.isSSHUser) ws._send('error');
        else ws._send({ status: 500 });
    }
};
exports.join = join;

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
            if (client.isSSHUser) client._send(`${ws.decoded.id} : ${message.content}`);
            else if (client.room === ws.room) client._send(result);
        });
    } catch (error) {
        if (ws.isSSHUser) ws._send('error');
        else ws._send({ status: 500 });
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
        if (ws.isSSHUser) ws._send('error');
        else ws._send({ status: 500 });
    }
};

exports.exit = (wss, ws) => {
    if (!ws.room) return;
    wss.clients.forEach(client => {
        if (ws.decoded.no === client.decoded.no) return;
        if (!client.room || ws.room !== client.room) return;
        if (client.isSSHUser) client._send(`${ws.decoded.id}님이 나갔습니다.`);
        else client._send({ type: 'EXIT', data: { room: ws.room, user: { id: ws.decoded.id, name: ws.decoded.name } } });
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
            if (client.isSSHUser) client._send(`${ws.decoded.id}님이 방에 입장했습니다.`);
            else client._send({ type: 'SEND', data: { type: 'ENTER', id, name } });
        });
    } catch (error) {
        if (ws.isSSHUser) ws._send('error');
        else ws._send({ status: 500 });
    }
};

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
            if (client.isSSHUser) client._send(`${ws.decoded.id}님이 방에서 퇴장했습니다.`);
            client._send({ type: 'SEND', data: { type: 'EXIT', id, name } });
        });
    } catch (error) {
        if (ws.isSSHUser) ws._send('error');
        else ws._send({ status: 500 });
    }
};

/* for ssh user */
exports.checkSSHId = (ws) => {
    ws._send('insert your id');
    ws.tid = setTimeout(() => ws.terminate(), 10000);
};

exports.checkSSHPassword = (ws, id) => {
    if (!id) return;
    clearTimeout(ws.tid);
    ws._send('insert your password');
    ws.id = id;
    ws.tid = setTimeout(() => ws.terminate(), 10000);
};

exports.checkSSHLogin = async (ws, password) => {
    if (!password || !ws.ip) return;
    try {
        const loginRes = await authModel.sshLogin(ws.id, password, ws.ip);
        const { status, result } = loginRes;
        if (status !== 200) {
            ws._send('login failure');
            throw Error();
        }
        const { data } = result;
        ws.decoded = data;

        clearTimeout(ws.tid);
        delete ws.id;
        delete ws.tid;

        ws._send('login success!!');
        ws._send('insert your room name');

        return true;
    } catch (error) {
        ws.terminate();
        return false;
    }
};

exports.checkSSHRoom = async (wss, ws, roomName) => {
    try {
        const roomRes = await roomModel.findNoByName(roomName);
        if (!roomRes.data) {
            ws._send(`${roomName} is not your chat room. try again`);
            return;
        }
        const { no } = roomRes.data;

        const message = { type: 'JOIN', no };
        join(wss, ws, message);
    } catch (error) {
        ws.terminate();
    }
};