const authModel = require('../../models/auth');

exports.register = async (req, res) => {
    const body = req.body;
    const password = body.password

    if (!body.id || !body.password || !body.name) {
        res.status(400).json();
        return;
    }
    
    try {
        const createRes = await authModel.create(body);
        const { status } = createRes;
        res.status(status).json();
    } catch (error) {
        res.status(500).json();
    }
}

exports.login = async (req, res) => {
    if (!req.body.id || !req.body.password || !req.headers['x-real-ip']) {
        res.status(400).json();
        return;
    }
    const ip = req.headers['x-real-ip'];
    const body = req.body;

    try {
        const loginRes = await authModel.login(body, ip);
        const { status } = loginRes;
        if (status !== 200) {
            res.status(status).json();
            return;
        }
        const { data, token } = loginRes.result;
        res
        .cookie('token', token, { path: '/', expires: new Date(Date.now() + (360000 * 24)), sameSite: 'none', secure: true })
        .status(status).json(data);
    } catch (error) {
        res.status(500).json();
    }
};

exports.logout = (req, res) => {
	res
	.cookie('token', '', { expires: new Date(Date.now() - (360000 * 24)) })
	.status(200)
    .json()
}
