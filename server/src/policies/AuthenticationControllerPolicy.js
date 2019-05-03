const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = {
	authenticateToken(req, res, next) {
		const token = (req) => {
			
			if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
				return req.headers.authorization.split(' ')[1];
			else if (req.query && req.query.token)
				return req.query.token;
			return null;
		};
		console.log(token(req));
		jwt.verify(token(req), config.authentication.jwtSecret, (err, decoded) => {
			console.log(err);
			if(decoded) {
				console.log('decoded!!');
				console.log(decoded);
				next();
			}
			else {
				res.status(401);
				res.json({'message' : err.name + ': ' + err.message});
			}
		});
	},
};