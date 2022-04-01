const invitationModel = require('../../models/invitation');

exports.create = async (req, res) => {
    if (!body.roomNo || !body.invitedUserNo|| !req.decoded || !req.decoded.no) {
        res.status(400).json();
        return;
    }
    if (req.decoded.no === body.invitedUserNo) {
        res.status(400).json();
        return;
    }
    
    const { invitedUserNo, roomNo } = req.body;
    const inviteUserNo = req.decoded.no;
    
    try {
        //리턴 400, 202(이미 초대), 204(이미 방에 존재), 201
        const { status } = await invitationModel.create(roomNo, inviteUserNo, invitedUserNo);
        
        res.status(status).json();
    } catch (error) {
        res.status(500).json();
    }
};
exports.findsByInvitedUser = async (req, res) => {
    if (!req.params.invitedUserNo) {
        res.status(400).json();
        return;
    }
    const invitedUserNo = req.params.no;
    
    try {
        const { status, data } = await invitationModel.findsByInvitedUser(invitedUserNo);
        res.json(data)
    } catch (error) {
        res.status(500).json();
    }
};
//유저 넘버와 방넘버를 받아서 삭제한다. 방 참여 거절용
exports.delete = async (req, res) => {
    if (!req.body.roomNo || !req.body.invitedUserNo) {
        res.status(400).json();
        return;
    }
    const { roomNo, invitedUserNo } = req.body;
    
    try {
        const { status } = await invitationModel.delete(roomNo, invitedUserNo);
        res.status(status).json();
    } catch (error) {
        res.status(500).json();
    }
}