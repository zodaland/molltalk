const hash = require('../library/hash');
const jwt = require('../library/token');
const db = require('../library/db');

exports.create = async (body) => {
    const { id, password, name } = body;
    try {
        const userCheckRes = await db.execute(
            'SELECT count(no) as count FROM user WHERE id = ?',
            id
        );
        const count = userCheckRes[0].count;
        if (count > 0) {
            return { status: 403 };
        }

        const hashPassword = hash.convert(password);
        const createRes = await db.execute(
            "INSERT INTO user (id, password, name, reg_date) VALUES (?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [id, hashPassword, name]
        );
        return { statue: 201 };
    } catch (error) {
        console.log(error);
        return { status: 500 };
    }
};

exports.login = async (body, ip) => {
    const { id, password } = body;

    try {
        const hashPassword = hash.convert(password);
        const verifyRes = await db.execute(
            'SELECT no,id, name FROM user WHERE id = ? AND password = ?',
            [id, hashPassword]
        );
        const data = verifyRes[0];

        const unixEpoch = Math.floor(new Date().getTime() / 1000);
        const hashIp = hash.convert(ip);
        await db.execute(
            "UPDATE user SET login_date = ?, ip = ? WHERE no = ?",
            [unixEpoch, hashIp, data.no]
        );
        const token = await jwt.set(data);

        return { status: 200, result: { data, token } };
    } catch (error) {
        console.log(error);
        return { status: 500 };
    }
};