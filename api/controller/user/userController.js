const userModel = require('../../models/user');

exports.findById = async (req, res) => {
    if (!req.params.id || !req.decoded.id || req.params.id === req.decoded.id) {
        res.status(400).json();
        return;
    }
    
    const { id } = req.params;
    const ownId = req.decoded.id;

    try {
        const { status, data } = await userModel.findById(id);
        if (status !== 200) {
            res.status(status).json();
            return;
        }
        res.json({ ...data });
    } catch (error) {
        res.status(500).json();
    }
}