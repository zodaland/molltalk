const authModel = require('../../models/auth');

exports.register = async (req, res) => {
    const body = req.body;
    const password = body.password

    if (!body.id || !body.password || !body.name) {
        res.status(400).json();
        return;
    }
    
    try {
        const { status } = await authModel.create(body);
        res.status(status).json();
    } catch (error) {
        res.status(500).json();
    }
}

exports.login = async (req, res) => {
    const body = req.body;

    if (!body.id || !body.password) {
        res.status(400).json();
        return;
    }

    try {
        const { status, result } = await authModel.login(body);
        if (status !== 201) {
            res.status(status).json();
            return;
        }
        const { data, token } = result;
        res
        .cookie('token', token, { path: '/', expires: new Date(Date.now() + (360000 * 24)), sameSite: 'none', secure: true, httpOnly: true })
        .status(status).json(data);
    } catch (error) {
        res.status(500).json();
    }
};

exports.check = (req, res) => {
	res.json({ ...req.decoded })
}

exports.logout = (req, res) => {
	res
	.cookie('token', '', { expires: new Date(Date.now() - (360000 * 24)) })
	.json({
		code: '0000'
	})
}
