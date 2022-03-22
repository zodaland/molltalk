const hash = require('../../library/hash')
const jwt = require('jsonwebtoken')

const db = require('../../library/db');

exports.register = async (req, res) => {
    const body = req.body;
    const password = body.password

    if (!body.id || !body.password || !body.name) {
        res.status(400).json();
        return;
    }
    
    try {
        const userCheckRes = await db.execute(
            'SELECT count(no) as count FROM user WHERE id = ?',
            body.id
        );
        const count = userCheckRes[0].count;
        if (count > 0) {
            res.status(403).json();
        }

        const hashPassword = hash.convert(password);
        const createRes = await db.execute(
            "INSERT INTO user (id, password, name, reg_date) VALUES (?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))",
            [body.id, hashPassword, body.name]
        );
        res.status(201).json();
    } catch (error) {
        console.log(error);
        res.status(400).json();
    }
}

exports.login = async (req, res) => {
    const body = req.body;
    const password = body.password;

    if (!body.id || !body.password) {
        res.status(400).json();
        return;
    }

    try {
        const hashPassword = hash.convert(password);
        const verifyRes = await db.execute(
            'SELECT no,id, name FROM user WHERE id = ? AND password = ?',
            [body.id, hashPassword]
        );
        const data = {
            no: verifyRes[0].no,
            id: verifyRes[0].id,
            name: verifyRes[0].name
        };
        const getRefreshToken = () => new Promise((resolve, reject) => {
            jwt.sign(
                data,
                req.app.get('jwt-secret'),
                {
                    expiresIn: '1d',
                    issuer: 'zodaland.com',
                    subject: 'refreshToken'
                }, (err, token) => {
                    if (err) {
                        reject();
                    }
                    res
                    .cookie('token', token, { path: '/', expires: new Date(Date.now() + (360000 * 24)), sameSite: 'none', secure: true, httpOnly: true });
                    resolve();
            });
        });
        const ip = req.headers['x-real-ip'];
        const unixEpoch = Math.floor(new Date().getTime() / 1000);
        const hashIp = hash.convert(ip);
        await db.execute(
            "UPDATE user SET login_date = ?, ip = ? WHERE no = ?",
            [unixEpoch, hashIp, verifyRes[0].no]
        );
                console.log(ip);
        const refreshToken = await getRefreshToken();

        res.json({ data });
    } catch (error) {
        console.log(error);
        res.status(400).json();
    }
};

exports.check = (req, res) => {
	res.json({
		no: req.decoded.no,
        id: req.decoded.id,
        name: req.decoded.name
	})
}

exports.logout = (req, res) => {
	res
	.cookie('token', '', { expires: new Date(Date.now() - (360000 * 24)) })
	.json({
		code: '0000'
	})
}