const roomModel = require('../../models/room');

exports.create = async (req, res) => {
    if (!req.body.name || !req.decoded || !req.decoded.no) {
        res.status(400).json();
        return;
    }
    const roomName = req.body.name;
    const userNo = req.decoded.no;

    try {
        const { status } = await roomModel.create(userNo, roomName);
        res.status(status).json();
    } catch (error) {
        res.status(500).json();
    }
};

exports.findsByNo = async (req, res) => {
    if (!req.decoded || !req.decoded.no) {
        res.status(400).json();
        return;
    }
    const no = req.decoded.no;

    try {
        const { status, data } = await roomModel.findsByNo(no);
        res.json(data);
    } catch (error) {
        res.status(500).json();
    }
}