// controllers are used for declaring all the endpoints
let {User} = require('../models');
const config = require('../config/config');
const passport = require('passport');
const randomToken = require('rand-token'); 
let refreshTokens = [];
// User.find().remove().exec();

module.exports = {
	async getUsers (req, res) {
		try {
			const users = await User.find();
			res.send(users);
		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred'
			});
		}
	},
	/**
	 * Adds a new user to db if req contains id of super user 
	 * and unique fields are unique -- otherwise responds with 400 error
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async addUser (req, res) {
		try {
			console.log(req.body);
			const realAdminUid = config.authentication.superUser;
			const adminId = req.body.id;
			const currUser = await User.findById(adminId);
			if(currUser.permission === realAdminUid){
				const pw = req.body.password;
				let user = new User();
				await user.createUser(req.body);
				await user.hashPassword(pw);
				user.save((err) => {
					if(err) {
						res.status(400).send({
							error: 'Email or contributor name already in use.'
						});
					}
					else {
						res.status(200).send({
							message: `User ${user.email} was created`
						});
					}
				});
			}
			else {
				res.status(400).send({
					error: 'Current User permissions are not allowed to perform this action.'
				});
			}
		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred'
			});
		}
	},

	/**
	 * Registers new user by hasing REQ password and saving 
	 * user data to db returning token and user
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async register (req, res) {
		try {
			console.log(req.body);
			const pw = req.body.password;
			// const permission = req.body.permission;
			// const contributorName = req.body.contributorName;
			// const email = req.body.email;
			let user = new User();
			await user.createUser(req.body);
			// set user email
			// user.email = email;
			// user.permission = permission;
			// user.contributorName = contributorName;

			// hash password and set pw
			await user.hashPassword(pw);
			// let userJson = user.toJSON();
			// console.log(userJson);
			user.save((err) => {
				if(err) {
					res.status(400).send({
						error: 'Email already in use'
					});
				}
				else {
					const token = user.generateToken();
					res.status(200).send({
						'token': token
					});
				}
			});
		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred'
			});
		}
	},
	/**
	 * Validates user by comparing hash of user plaintext pw
	 * to hash stored in db returning token and user details if
	 * valid
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	login (req, res) {
		// console.log('inside login');
		passport.authenticate('local', (err, user, info) => {			
			if (err) {
				// console.log('ERROR IN LOGIN');
				res.status(404).json(err);
				return;
			}
			if (user) {
				// console.log(user);
				const token = user.generateToken();
				const refreshToken = randomToken.uid(256);
				
				refreshTokens[refreshToken] = user.email;
				console.log(refreshTokens);
				res.status(200).send({
					'token': token,
					'refreshToken': refreshToken,
					'user': {_id: user._id, email: user.email, contributorName: user.contributorName, permission: user.permission}
				});
			} else {
				// console.log('ANOTHER ERROR');
				res.status(401).json(info);
			}
		})(req, res);
	},

	/**
	 * Extracts email and refresh token from body and if valid: responds with new token
	 * otherwise send 401
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async refreshToken (req, res) {
		const email = req.body.email;
		const refreshToken = req.body.refreshToken;
		console.log(res.body);
		try {
			if((refreshToken in refreshTokens) &&  refreshTokens[refreshToken] === email) {
				await User.findOne({email: email}, (err, user)=>{
					if(!user) {
						res.status(401).send({error: err});
					}
					else {
						const token = user.generateToken();
						res.status(200).send({'token': token});
					}
				});
			}
			else {
				res.status(401).send({error: 'Unauthorized! Please log in and try again.'});
			}
		} catch (err) {
			res.status(401).send({
				'error': 'Unexpected Error occurred!'
			});
		}
	},
	/**
	 * Extracts refreshtoken from req and if found, deletes refreshtoken from global array
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	rejectToken (req, res) {
		const refreshToken = req.body.refreshToken;
		if(refreshToken in refreshTokens) {
			delete refreshTokens[refreshToken];
		}
		res.sendStatus(204);
	}
};