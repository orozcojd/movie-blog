const jwt = require('jsonwebtoken');
const config = require('../config/config');
const helpers = require('../helpers/Auth');

module.exports = {
	/**
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	authenticateToken(req, res, next) {
		const token = helpers.getTokenRequest(req);

		jwt.verify(token, config.authentication.jwtSecret, (err, decoded) => {
			if(decoded) {
				// console.log(token(req));
				req.userId = decoded._id;
				req.token = token;
				next();
			}
			else {
				res.status(401);
				res.json({error : err.name + ': ' + err.message});
			}
		});
	},
	/**
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	validatePassword(req, res, next) {
		if(req.body.pass !== req.body.passConfirm) {
			res.status(400).send({error: 'Your passwords do not match. Please enter them again.'});
		}
		if(req.body.pass.trim().length <= 5 || req.body.pass.length > 60) {
			res.status(400).send({error: 'Password must be between 5 and 60 characters.'});
		}
		else {
			next();
		}
	},
	/**
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	async contributorAccessControl(req, res, next) {
		const isAuthorized = await helpers.authenticateRequest(req);
		if(!isAuthorized) {
			res.status(403).send({
				message: 'You are unauthorized to make changes to this account!'
			});
			res.end();
		}
		next();
	}
};