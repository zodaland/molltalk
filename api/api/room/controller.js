const room = require('../../models/room')
const Error = require('../../library/error')

const db = require('../../library/db');

exports.create = async (req, res) => {
    const body = req.body;
    const no = req.decoded.no;

    try {
        const roomRes = await db.execute(
            "INSERT INTO room (reg_date, name) VALUES (DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), ?)",
            body.name
        );
        const roomNo = roomRes.insertId;

        
        await db.execute(
            "INSERT INTO room_user (user_no, room_no, join_date) VALUES (?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [no, roomNo]
        );
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
};

exports.find = async (req, res) => {
    const no = req.decoded.no;

    try {
        const roomRes = await db.execute(
            'SELECT room.no, room.name FROM room LEFT JOIN room_user ON room.no = room_user.room_no WHERE room_user.user_no = ?',
            no
        );
        res.json(roomRes);
    } catch (error) {
        res.status(500).json();
    }
}