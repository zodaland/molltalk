const db = require('../../../library/db');

exports.create = async (req, res) => {
    const body = req.body;
    const roomNo = body.roomNo;
    const userNo = req.decoded.no;

    if (!roomNo || !userNo) {
        res.status(400).json();
        return;
    }

    try {
        const inviteRes = await db.execute(
            'SELECT count(no) AS count FROM invitation WHERE room_no = ? AND invited_user_no = ?',
            [roomNo, userNo]
        );
        const count = inviteRes[0].count;
        if (count < 1) {
            res.status(401).json();
            return;
        }
        await db.execute(
            'DELETE FROM invitation WHERE room_no = ? AND invited_user_no = ?',
            [roomNo, userNo]
        );
        
        await db.execute(
            "INSERT INTO room_user (room_no, user_no, join_date) VALUES (?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [roomNo, userNo]
        );
        res.json();
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
};

exports.findRooms = async (req, res) => {
    const userNo = req.decoded.no;

    if (!userNo) {
        res.status(400).json();
        return;
    }

    try {
        const roomUserRes = await db.execute(
            'SELECT room_no from room_user WHERE user_no = ?',
            userNo
        );
        res.json(roomUserRes);
    } catch (error) {
        res.status(500).json();
    }
};

exports.delete = async (req, res) => {
    const params = req.params;
    const roomNo = params.no;
    const userNo = req.decoded.no;
    if (!roomNo || !userNo) {
        res.status(400).json();
        return;
    }
    try {
        await db.execute(
            'DELETE FROM room_user WHERE room_no = ? AND user_no = ?',
            [roomNo, userNo]
        );
        
        const roomUserRes = await db.execute(
            'SELECT count(no) AS count FROM room_user WHERE room_no = ?',
            roomNo
        );
        const roomUserCount = roomUserRes[0].count;
        if (roomUserCount < 1) {
            await db.execute(
                'DELETE FROM room WHERE no = ?',
                roomNo
            );
        }            
        res.json();
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
};