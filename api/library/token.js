const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt_config');
const logger = require('./log');
//토큰 디코드
exports.decode = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, jwtConfig.secretKey, (error, decoded) => {
        if (error) {
            logger.error(token);
            logger.error(error);
            reject(error);
        }
        resolve(decoded);
    });
});
//request내에서 토큰을 찾은 뒤 리턴
//express : cookies, ws : headers['cookie']
exports.get = (req) => {
	let token = null;
	if (req.cookies !== undefined) {
		token = req.cookies.token;
	} else if (req.headers['cookie'] !== undefined) {
		const cookies = req.headers['cookie'].split('; ');
		const cookie = cookies.find(e => e.indexOf('token=') === 0);
		token = cookie.split('=')[1];
	}
	return token;
};
exports.set = (payload) => new Promise((resolve, reject) => {
    jwt.sign(
        payload,
        jwtConfig.secretKey,
        {
            expiresIn: '1d',
            issuer: 'zodaland.com',
            subject: 'refreshToken'
        }, (error, token) => {
            if (error) {
                logger.error(error);
                reject();
            }
            resolve(token);
    });
});