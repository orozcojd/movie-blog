// controllers are used for declaring all the endpoints
let {User} = require('../models');
let {Contributor} = require('../models');
const {Post} = require('../models');

const config = require('../config/config');
const passport = require('passport');
const randomToken = require('rand-token'); 
let refreshTokens = [];
// Contributor.find().remove().exec();

module.exports = {
	
	async getContributor (req, res) {
		const id = req.params.contributorId;
		try {
			const contributor = await Contributor.findOne({_id: id});
			if(contributor) {
				res.send(contributor);
			}
			else {
				console.log('inside else');
				res.status(404).send({
					error: 'The resource is not found'
				});
			}
		} catch (err) {
			console.log(err);
			res.status(400).send({
				
				error: 'Unexpected error has occurred'
			});
		}
	},

	async updateContributor (req, res) {
		try {
			// get contributor name - save it
			const contributorId = req.params.contributorId;
			let contributorName = await Contributor.findOne({_id: contributorId});
			contributorName = contributorName.name;
			let updateName = false;
			if(req.body.name !== contributorName) {
				updateName = true;
			}
			
			const contributor = await Contributor.findOneAndUpdate(
				{_id: contributorId},
				req.body,
				{new: true}
			);
			let updated;
			if(updateName) {
				updated = await Post.updateMany({contributorId: contributorId}, {
					author: req.body.name
				});
			}
			let message = 'Contributor information Updated! ';
			if(updated) {
				message += updated.nModified.toString() + ' Article(s) were updated reflecting name change.';
			}
			res.send({
				contributor: contributor,
				message: message
			});

		} catch(err) {
			console.log(err);
			res.status(400).send({
				error: 'Unexpected error has occurred'
			});
		}

	},
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
			// console.log(req.body);


			
			const realAdminUid = config.authentication.superUser;
			const adminId = req.body.id;
			const currUser = await User.findById(adminId);
			if(currUser.permission === realAdminUid){
				const pw = req.body.password;
				let contributor = new Contributor();
				await contributor.createContributor({name: req.body.contributorName});
				contributor.save(async (err, contrib) => {
					if(err) {
						res.status(400).send({
							error: 'Contributor name already in use.'
						});
					}
					else {
						let user = new User();
						const referenceId = contrib._id;
						await user.createUser({...req.body, contributorId: referenceId});
						await user.hashPassword(pw);
						user.save((err, saved) => {
							if(err) {
								res.status(400).send({
									error: 'Email or contributor name already in use.'
								});
							}
							else {
								res.status(200).send({
									message: `User ${user.email} was created`,
									user: saved,
									contributor: contrib
								});
							}
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
				error: 'Unexpected error has occurred',
				details: err
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
			const pw = req.body.password;
			let contributor = new Contributor();
			await contributor.createContributor({name: req.body.contributorName});
			contributor.save(async (err, contrib) => {
				if(err) {
					res.status(400).send({
						error: 'Contributor name already in use.'
					});
				}
				else {
					let user = new User();
					const referenceId = contrib._id;
					await user.createUser({...req.body, contributorId: referenceId});
					await user.hashPassword(pw);
					user.save((err, saved) => {
						if(err) {
							res.status(400).send({
								error: 'Email or contributor name already in use.'
							});
						}
						else {
							res.status(200).send({
								message: `User ${user.email} was created`,
								user: saved,
								contributor: contrib
							});
						}
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
					'user': {_id: user._id, email: user.email, contributorId: user.contributorId, permission: user.permission}
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