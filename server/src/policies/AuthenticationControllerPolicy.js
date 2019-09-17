const jwt = require('jsonwebtoken');
const config = require('../config/config');
const helpers = require('../helpers/Auth');
const request = require('request');


module.exports = {
	recaptchaPolicy(req, res, next) {
		if(process.env.NODE_ENV !== 'production') return next();
		if(!req.body.recaptchaToken) {
			return res.status(400).send({
				error: 'Recaptcha Token required!'
			});
		}
		const verifyCaptchaOptions = {
			uri: 'https://www.google.com/recaptcha/api/siteverify',
			json: true,
			form: {
				secret: config.authentication.recaptchaSecret,
				response: req.body.recaptchaToken
			}
		};
		request.post(verifyCaptchaOptions, async (err, response, body) => {
			if (err) {
				return res.status(500).json({message: 'oops, something went wrong...'});
			}
			if (!body.success) {
				return res.status(500).json({message: body['error-codes'].join('.')});
			}
			next();
		});
	},
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
			return res.status(403).send({
				error: 'You are unauthorized to make changes to this account!'
			});
		}
		next();
	}
};