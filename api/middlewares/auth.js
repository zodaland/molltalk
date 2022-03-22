const jwt = require('jsonwebtoken')
const token = require('../library/token')
const user = require('../models/user')
const Error = require('../library/error')
const hash = require('../library/hash')

const authMiddleware = async (req, res, next) => {
	const refreshToken = token.get(req)
	const authorization = req.headers['authorization']
	const ip = req.headers['x-real-ip']

	//preflight시 메소드 OPTIONS 으로 들어오고 에러 처리돼서 예외처리
	if (req.method === 'OPTIONS') {
		return res.json()
	}

	if (!refreshToken || !ip) {
        res.status(403).json();
		return ;
	}

const db = require('../library/db');
	try {
			const decoded = await token.decode(refreshToken, req.app.get('jwt-secret'))
			const userData = await db.execute(
                'SELECT ip FROM user WHERE no = ?',
                decoded.no
            );
			if (userData[0].ip !== hash.convert(ip)) {
				throw new Error('AUTHENTICATION_FAILURE')
			}
            req.decoded = decoded
            next();
	} catch(error) {
        console.log(error);
		return res
            .cookie('token', '', { expires: new Date(Date.now() - (360000 * 24)) })
            .status(401)
            .json();
	}
}

module.exports = authMiddleware
