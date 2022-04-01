const db = require('../library/db');
//초대장을 생성한다.
exports.create = async (roomNo, inviteUserNo, invitedUserNo) => {
    try {
        //방이 있는지 확인한다.
        const [roomRes] = await db.execute(
            'SELECT count(no) as count FROM room WHERE no = ?',
            roomNo
        );
        if (!roomRes || !roomRes.count) throw new Error();
        if (roomRes.count < 1) return { status: 400 };
        //유저가 존재하는지 확인한다.
        const [userRes] = await db.execute(
            'SELECT count(no) as count FROM user where no = ?',
            invitedUserNo
        );
        if (!userRes || !userRes.count) throw new Error();
        if (userRes.count < 1) return { status: 400 };
        //이미 초대된 유저인지 확인한다.
        const [alreadyInviteRes] = await db.execute(
            'SELECT count(no) as count FROM invitation WHERE invite_user_no = ? AND invited_user_no = ?',
            [inviteUserNo, invitedUserNo]
        );
        if (!alreadyInviteRes || !alreadyInviteRes.count) throw new Error();
        if (alreadyInviteRes.count > 0) return { status: 202 };
        //이미 방에 있는 유저인지 확인한다.
        const [alreadyRoomRes] = await db.execute(
            'SELECT count(no) as count FROM room_user WHERE room_no = ? AND user_no = ?',
            [roomNo, invitedUserNo]
        );
        if (!alreadyRoomRes || !alreadyRoomRes.count) throw new Error();
        if (alreadyRoomRes.count > 0) return { status: 204 };
        //초대장을 생성한다.
        await db.execute(
            "INSERT INTO invitation (room_no, invite_user_no, invited_user_no, reg_date) VALUES(?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [roomNo, inviteUserNo, invitedUserNo]
        );
        
        return { status: 201 };
    } catch (error) {
        throw new Error();
    }
};
//초대된 초대장을 찾는다.
exports.findsByInvitedUser = async (invitedUserNo) => {
    try {
        const data = await db.execute(
            'SELECT a.name, b.room_no, c.id FROM room AS a RIGHT JOIN invitation AS b ON a.no = b.room_no LEFT JOIN user AS c ON b.invite_user_no = c.no WHERE b.invited_user_no = ?',
            invitedUserNo
        );
        return { data, status: 200 };
    } catch (error) {
        throw new Error();
    }
};
//유저 넘버와 방넘버를 받아서 삭제한다. 방 참여 거절용
exports.delete = async (roomNo, invitedUserNo) => {
    try {
        const [inviteRes] = await db.execute(
            'SELECT count(no) AS count FROM invitation WHERE room_no = ? AND invited_user_no = ?',
            [roomNo, invitedUserNo]
        );
        if (!inviteRes || !inviteRes.count) throw new Error();
        if (inviteRes.count < 1) return { status: 400 };
        await db.execute(
            'DELETE FROM invitation WHERE room_no = ? AND invited_user_no = ?',
            [roomNo, invitedUserNo]
        );
        return { status: 200 };
    } catch (error) {
        throw new Error();
    }
}
