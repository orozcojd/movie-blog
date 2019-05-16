// controllers are used for declaring all the endpoints
let {User} = require('../models');
let {Contributor} = require('../models');
const {Post} = require('../models');

const config = require('../config/config');
const passport = require('passport');
const randomToken = require('rand-token');
const helpers = require('../helpers/Auth');
let refreshTokens = [];
// Post.find().remove().exec();
// User.find({
// }).remove().exec();

module.exports = {
	
	/**
	 * GET REQUEST
	 * Given the contributor id in the req params, returns the contributor model
	 * if found otherwise a 404 response
	 * @param {Object} req 
	 * @param {Object} res 
	 */
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

	/**
	 * PUT REQUEST
	 * Updates the contributor info in the db and returns the updated Model
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async updateContributor (req, res) {
		try {
			// get contributor name - save it
			const contributorId = req.params.contributorId;
			
			if(!await helpers.authenticateRequest(req)) {
				res.status(403).send({
					message: 'You are unauthorized to make changes to this account!'
				});
				return;
			}
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
	/**
	 * GET REQUEST
	 * Returns all users found in the database
	 * @param {Object} req 
	 * @param {Object} res 
	 */
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
	 * POST REQUEST
	 * Adds a new user to db if req contains id of super user 
	 * and unique fields are unique -- otherwise responds with 400 error
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async addUser (req, res) {
		try {
			// prevents unauthorized user from making changes
			// const contributorId = req.body.contributorId;
			// const verifyUser = await User.findById(req.userId);
			
			if(!await helpers.authenticateTokenUser(req)) {
				res.status(403).send({
					message: 'You are unauthorized to make changes to this account!'
				});
				return;
			}
			const realAdminUid = config.authentication.superUser;
			const currUser = await User.findById(req.userId);
			if(currUser.permission === realAdminUid){
				const pw = req.body.password;
				let contributor = new Contributor();
				await contributor.createContributor({name: req.body.contributorName});
				contributor.save(async (err, contrib) => {
					if(err) {
						res.status(400).send({
							error: err,
							details: err
						});
						console.log(err);
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
	 * POST REQUEST
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
	 * POST REQUEST
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
	 * POST REQUEST
	 * Extracts email and refresh token from body and if valid: responds with new token
	 * otherwise send 401
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async refreshToken (req, res) {
		const email = req.body.email;
		const refreshToken = req.body.refreshToken;
		console.log(res.body);
		console.log(refreshTokens);
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
	/** POST REQUEST
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