const db = require('../../library/db');

exports.findById = async (req, res) => {
    const params = req.params;
    const id = params.id;
    const ownId = req.decoded.id;

    if (!id || id === ownId) {
        res.status(400).json();
        return;
    }

    try {
        const result = await db.execute(
            'SELECT no FROM user WHERE id = ?',
            id
        );
        const no = result[0].no;
        res.json({
            no: no,
            id: id,
        });
    } catch (error) {
        res.status(500).json();
    }
}