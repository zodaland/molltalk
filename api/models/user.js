const db = require('../library/db');

exports.findById = async (id) => {
    try {
        const [result] = await db.execute(
            'SELECT no FROM user WHERE id = ?',
            id
        );
        if (!result) return { status: 400 };
        const no = result.no;
        const data = { no, id };
        
        return { status: 200, data };
    } catch (error) {
        throw new Error();
    }
}