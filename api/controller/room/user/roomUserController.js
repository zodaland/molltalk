const roomUserModel = require('../../../models/roomUser');

exports.create = async (req, res) => {
    if (!req.body.no || !req.decoded) {
        res.status(400).json();
        return;
    }
    const roomNo = req.body.no;
    const userNo = req.decoded.no;
    const { id, name } = req.decoded;
    
    try {
        const { status } = await roomUserModel.create(roomNo, userNo);
        res.status(status).json();
    } catch (error) {
        res.status(500).json();
    }
};

exports.findRoomUsers = async (req, res) => {
    if (!req.decoded || !req.decoded.no) {
        res.status(400).json();
        return;
    }
    const userNo = req.decoded.no;

    try {
        const { status, data } = await roomUserModel.findRoomUsers(userNo);
        res.json(data);
    } catch (error) {
        res.status(500).json();
    }
};

exports.delete = async (req, res) => {
    if (!req.params.no || !req.decoded) {
        res.status(400).json();
        return;
    }
    const roomNo = req.params.no;
    const userNo = req.decoded.no;
    const { id, name } = req.decoded;
    
    try {
        const { status } = await roomUserModel.delete(roomNo, userNo); 
        res.status(status).json();
    } catch (error) {
        res.status(500).json();
    }
};