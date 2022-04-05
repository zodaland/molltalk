const db = require('../library/db');
//유저가 방에 입장한다.
exports.create = async (roomNo, userNo) => {
    try {
        //초대장이 있는지 조회
        const [inviteRes] = await db.execute(
            'SELECT count(no) AS count FROM invitation WHERE room_no = ? AND invited_user_no = ?',
            [roomNo, userNo]
        );
        if (typeof inviteRes === 'undefined') throw new Error();
        if (inviteRes.count < 1) return { status: 403 };
        //이미 방에 있는지 조회
        const [roomRes] = await db.execute(
            'SELECT count(no) AS count FROM room_user where room_no = ? AND user_no = ?',
            [roomNo, userNo]
        );
        if (typeof roomRes === 'undefined') throw new Error()
        if (roomRes.count > 0) return { status: 403 };
        //초대장은 제거
        await db.execute(
            'DELETE FROM invitation WHERE room_no = ? AND invited_user_no = ?',
            [roomNo, userNo]
        );
        //방 유저에 추가
        await db.execute(
            "INSERT INTO room_user (room_no, user_no, join_date) VALUES (?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [roomNo, userNo]
        );
        return { status: 201 };
    } catch (error) {
        throw new Error();
    }
};
//유저가 들어가있는 방 전체를 조회한다.
exports.findRoomUsers = async (userNo) => {
    try {
        //유저가 있는 방 조회
        const data = await db.execute(
            'SELECT room_no from room_user WHERE user_no = ?',
            userNo
        );
        return { status: 200, data };
    } catch (error) {
        throw new Error();
    }
};
//유저가 퇴장하고 방에 아무도 없다면 방을 제거한다.
exports.delete = async (roomNo, userNo) => {
    try {
        //유저를 방에서 제거한다.
        await db.execute(
            'DELETE FROM room_user WHERE room_no = ? AND user_no = ?',
            [roomNo, userNo]
        );
        //방에 있는 유저 수를 조회한다.
        const [roomUserRes] = await db.execute(
            'SELECT count(no) AS count FROM room_user WHERE room_no = ?',
            roomNo
        );
        if (typeof roomUserRes === 'undefined') return { status: 200 };
        //방에 유저가 없으면 방을 제거한다.
        if (roomUserRes.count < 1) {
            await db.execute(
                'DELETE FROM room WHERE no = ?',
                roomNo
            );
        }            
        return { status: 200 };
    } catch (error) {
        throw new Error();
    }
};