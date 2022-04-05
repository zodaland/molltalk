const token = require('../library/token');
const userModel = require('../models/user');

const wsMiddleware = async (req, socket, head) => {
    const ip = req.headers['x-real-ip'];
    const refreshToken = token.get(req);

    //임시
    if (ip === '49.247.19.16') {
        return;
    }

    if (!refreshToken || !ip) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    try {
        const decoded = await token.decode(refreshToken);
        const ipRes = await userModel.compareIp(ip, decoded.no);
        if (ipRes.status !== 200) throw new Error();
    } catch(error) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
    }
};

module.exports = wsMiddleware;