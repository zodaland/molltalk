const db = require('../library/db');

exports.create = async (userNo, roomName) => {
    try {
        const { insertId } = await db.execute(
            "INSERT INTO room (reg_date, name) VALUES (DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), ?)",
            roomName
        );
        
        await db.execute(
            "INSERT INTO room_user (user_no, room_no, join_date) VALUES (?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [userNo, insertId]
        );
        return ({ status: 201 });
    } catch (error) {
        console.log(error);
        throw new Error();
    }
};

exports.findsByNo = async (userNo) => {
    try {
        const data = await db.execute(
            'SELECT room.no, room.name FROM room LEFT JOIN room_user ON room.no = room_user.room_no WHERE room_user.user_no = ?',
            userNo
        );
        return ({ data, status: 200 });
    } catch (error) {
        throw new Error();
    }
}

exports.findNameByNo = async (roomNo) => {
    try {
        const [data] = await db.execute(
            'SELECT name FROM room WHERE no = ?',
            roomNo
        );
        return { status: 200, data };
    } catch(error) {
        throw new Error();
    }
}