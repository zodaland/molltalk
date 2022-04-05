const jwt = require('jsonwebtoken');
const token = require('../library/token');
const userModel = require('../models/user');

const authMiddleware = async (req, res, next) => {
	const refreshToken = token.get(req);
	const ip = req.headers['x-real-ip'];

	//preflight시 메소드 OPTIONS 으로 들어오고 에러 처리돼서 예외처리
	if (req.method === 'OPTIONS') {
		return res.json();
	}

	if (!refreshToken || !ip) {
        res.status(403).json();
		return ;
	}

	try {
			const decoded = await token.decode(refreshToken);
			const { status } = await userModel.compareIp(ip, decoded.no);
            if (status !== 200) {
                throw new Error();
            }
            req.decoded = decoded;
            next();
	} catch(error) {
		res
            .cookie('token', '', { expires: new Date(Date.now() - (360000 * 24)) })
            .status(401)
            .json();
	}
}

module.exports = authMiddleware;
