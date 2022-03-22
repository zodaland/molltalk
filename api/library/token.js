const jwt = require('jsonwebtoken')
//��ū ���ڵ�
exports.decode = (token, secretKey) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secretKey, (error, decoded) => {
			if (error) {
				reject(error)
			}
			resolve(decoded)
		})
	})
}
//request������ ��ū�� ã�� �� ����
//express : cookies, ws : headers['cookie']
exports.get = (req) => {
	let token = ''
	if (req.cookies !== undefined) {
		token = req.cookies.token
	} else if (req.headers['cookie'] !== undefined) {
		const cookies = req.headers['cookie'].split('; ')
		const cookie = cookies.find(e => e.indexOf('token=') === 0)
		token = cookie.split('=')[1]
	}
	return token
}