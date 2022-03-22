const invitation = require('../../models/invitation')
const room = require('../../models/room')
const user = require('../../models/user')
const Error = require('../../library/error')

const db = require('../../library/db');

exports.create = async (req, res) => {
    const body = req.body;
    const inviteUserNo = req.decoded.no;
    
    if (!body.roomNo || !inviteUserNo || !body.invitedUserNo) {
        res.status(400).json();
        return;
    }
    if (inviteUserNo === body.invitedUserNo) {
        res.status(400).json();
        return;
    }
    
    try {
        const roomRes = await db.execute(
            'SELECT count(no) as count FROM room WHERE no = ?',
            body.roomNo
        );
        const roomCount = roomRes[0].count;
        if (roomCount < 1) {
            res.status(400).json();
            return;
        }
        const userRes = await db.execute(
            'SELECT count(no) as count FROM user where no = ?',
            body.invitedUserNo
        );
        const userCount = userRes[0].count;
        if (userCount < 1) {
            res.status(400).json();
            return;
        }
        const alreadyInviteRes = await db.execute(
            'SELECT count(no) as count FROM invitation WHERE invite_user_no = ? AND invited_user_no = ?',
            [inviteUserNo, body.invitedUserNo]
        );
        const alreadyInviteCount = alreadyInviteRes[0].count;
        if (alreadyInviteCount > 0) {
            res.status(202).json();
            return;
        }
        const alreadyRoomRes = await db.execute(
            'SELECT count(no) as count FROM room_user WHERE room_no = ? AND user_no = ?',
            [body.roomNo, body.invitedUserNo]
        );
        const alreadyRoomCount = alreadyInviteRes[0].count;
        if (alreadyRoomCount > 0) {
            res.status(204).json();
            return;
        }

        const inviteRes = await db.execute(
            "INSERT INTO invitation (room_no, invite_user_no, invited_user_no, reg_date) VALUES(?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [body.roomNo, inviteUserNo, body.invitedUserNo]
        );
        
        const roomNameRes = await db.execute(
            'SELECT name FROM room WHERE no = ?',
            body.roomNo
        );
        console.log(roomNameRes);
        const roomName = roomNameRes[0].name;
        res.json(roomName);
    } catch (error) {
        res.status(500).json();
    }
};

exports.findByInviteUser = (req, res) => {
	const params = req.params
	const inviteUserNo = params.no

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (inviteUserNo === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(inviteUserNo)
		})
	}

    const checkUser = (result) => {
		return new Promise((resolve, reject) => {
            const userId = result[0].id;
			if (!userId) {
				reject('FOUND_NO_DATA')
			}
			resolve(userId)
		})
	}

	const respond = (result) => {
		res
		.json({
			code: '0000',
			data: result
		})
	}

	const respondError = (error) => {
		res
		.status(409)
		.json(Error.get(error))
	}

	checkValue()
    .then(user.getConnection)
    .then(user.getIdByNo)
    .then(checkUser)
	.then(invitation.getConnection)
	.then(invitation.findByInviteUser)
	.then(respond)
	.catch(respondError)
}
exports.findByInvitedUser = async (req, res) => {
    const params = req.params;
    const invitedUserNo = params.no;
    
    if (!invitedUserNo) {
        res.status(400).json();
        return;
    }
    try {
        const invitedRes = await db.execute(
            'SELECT a.name, b.room_no, c.id FROM room AS a RIGHT JOIN invitation AS b ON a.no = b.room_no LEFT JOIN user AS c ON b.invite_user_no = c.no WHERE b.invited_user_no = ?',
            invitedUserNo
        );
        console.log(invitedRes);
        res.json(invitedRes);
    } catch (error) {
        res.status(500).json();
    }
};

exports.delete = (req, res) => {
	const params = req.params
	const no = params.no

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (no === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(no)
		})
	}

	const respond = (result) => {
		res.json({
			code: '0000',
			data: result.affectedRows
		})
	}

	const respondError = (error) => {
		res
		.status(409)
		.json(Error.get(error))
	}

	checkValue()
	.then(invitation.getConnection)
	.then(invitation.delete)
	.then(respond)
	.catch(respondError)
	
}
