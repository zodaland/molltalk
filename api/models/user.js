const db = require('../library/db');
const hash = require('../library/hash');
const logger = require('../library/log');

exports.findById = async (id) => {
    try {
        const [result] = await db.execute(
            'SELECT no, name FROM user WHERE id = ?',
            id
        );
        if (!result) return { status: 400 };
        const { name, no } = result;
        const data = { no, id, name };
        
        return { status: 200, data };
    } catch (error) {
        logger.error(error);
        throw new Error();
    }
}
exports.compareIp = async (ip, no) => {
    try {
        const hashIp = hash.convert(ip);
        const [userData] = await db.execute(
            'SELECT ip FROM user WHERE no =?',
            no
        );
        if (hashIp !== userData.ip) {
            return ({ status: 401 });
        }
        return ({ status: 200 });
    } catch (error) {
        logger.error(error);
        throw new Error();
    }
}