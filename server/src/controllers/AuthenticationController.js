// controllers are used for declaring all the endpoints
let {User} = require('../models');
const config = require('../config/config');
const passport = require('passport');
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
						const token = user.generateToken();
						res.status(200).send({
							// user: {
							// 	email: user.email,
							// 	permission: user.permission,
							// 	contributorName: user.contributorName
							// },
							token: token
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
					let token;
					token = user.generateToken();
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
			// console.log('PASSPORT CALL');
			let token;
			if (err) {
				// console.log('ERROR IN LOGIN');
				res.status(404).json(err);
				return;
			}
			if (user) {
				// console.log(user);
				token = user.generateToken();
				res.status(200).send({
					'token': token,
					'user': user.email
				});
			} else {
				// console.log('ANOTHER ERROR');
				res.status(401).json(info);
			}
		})(req, res);
	}
};