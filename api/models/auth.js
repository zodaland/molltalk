const hash = require('../library/hash');
const jwt = require('../library/token');
const db = require('../library/db');
//유저를 생성한다.
exports.create = async (body) => {
    try {
        const { id, password, name } = body;
        const [userCheckRes] = await db.execute(
            'SELECT count(no) as count FROM user WHERE id = ?',
            id
        );
        if (typeof userCheckRes === 'undefined') {
            throw new Error();
        }
        if (userCheckRes.count > 0) {
            return { status: 403 };
        }

        const hashPassword = hash.convert(password);
        const createRes = await db.execute(
            "INSERT INTO user (id, password, name, reg_date) VALUES (?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [id, hashPassword, name]
        );
        return { status: 201 };
    } catch (error) {
        throw new Error();
    }
};

exports.login = async (body, ip) => {
    try {
        const { id, password } = body;
        const hashPassword = hash.convert(password);
        const [verifyRes] = await db.execute(
            'SELECT no,id, name FROM user WHERE id = ? AND password = ?',
            [id, hashPassword]
        );
        if (!verifyRes) return ({ status: 401 });
        const data = { ...verifyRes };

        const unixEpoch = Math.floor(new Date().getTime() / 1000);
        const hashIp = hash.convert(ip);
        await db.execute(
            "UPDATE user SET login_date = ?, ip = ? WHERE no = ?",
            [unixEpoch, hashIp, data.no]
        );
        const token = await jwt.set(data);

        return { status: 200, result: { data, token } };
    } catch (error) {
        throw new Error();
    }
};