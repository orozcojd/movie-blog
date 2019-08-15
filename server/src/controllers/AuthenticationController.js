// controllers are used for declaring all the endpoints
let {User} = require('../models');
let {Contributor} = require('../models');
const {Post} = require('../models');
// const nodemailer = require('nodemailer');
const { sendResetPwEmail } = require('../services/MailService'); 
const config = require('../config/config');
const passport = require('passport');
const randomToken = require('rand-token');
const helpers = require('../helpers/Auth');
const contributorHelpers = require('../helpers/Contributor');

let refreshTokens = [];
// Post.find().remove().exec();
// User.find({
// }).remove().exec();


module.exports = {
	/**
	 * POST
	 * If user associated to email in response exists, calls nodemailer to 
	 * send email instructions for restarting pasword.
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async forgotPassword(req, res) {
		try {
			const email = req.body.email;
			const user = await User.findOne({email: email});
			if(user){
				const contributor = await Contributor.findById(user.contributorId);
				user.generatePwToken();
				user.save(async (err, saved) => {
					if(!err) {
						await sendResetPwEmail(user, contributor);
					}
				});
			}
			res.status(200).send({message: 'Please check your email for instructions on how to reset your password.'});
		} catch (err) {
			console.log(err);
			res.status(400).send({
				data: err,
				error: 'Unexpected error has occurred trying to reset password'
			});
		}
	},
	
	/**
	 * POST
	 * Validates passwords, if id from request is valid, updates the passwords
	 * in db
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async resetPassword (req, res) {
		try {
			let status = 200;
			let error = '';
			const user = await User.findById(req.userId);
			const tokenUsed = user.resetToken !== req.token;
			if(tokenUsed) {
				status = 403;
				error = 'Token has been already used. To reset your password again, please restart the process from the login page.';
			}
			else {
				await user.hashPassword(req.body.pass);
				user.resetToken = null;
				user.save((err, saved) => {
					if(err) {
						error = err;
						status = 400;
					}
					else {
						// successful block
						const token = user.generateToken();
						const refreshToken = randomToken.uid(256);
						refreshTokens[refreshToken] = user.email;
						const response = {
							message: 'Your password has been successfully updated.',
							token: token,
							refreshToken: refreshToken,
							user: {_id: user._id, email: user.email, contributorId: user.contributorId, permission: user.permission}
						};
						res.status(200).send(response);
					}
				});
				return; // needed so headers aren't overwritten
			}
			// send error case
			res.status(status).send({error: error});
		} catch (err) {
			console.log(err);
			res.status(400).send({
				data: err,
				error: 'Unexpected error has occurred trying to reset password.'
			});
		}
	},

	/**
	 * POST
	 * Retrieves the contributor name mapped from the user ID in the request.
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async getContributorName (req, res) {
		try {
			const currUser = await User.findById(req.userId).lean();
			const contributor = await Contributor.findById(currUser.contributorId).lean();
			res.status(200).send({name: contributor.name});

		} catch (err) {
			res.status(400).send({
				data: err,
				error: 'Unexpected error has occurred trying to get contributor information'
			});
		}
	},
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
				console.log(contributor);
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
			const contributorId = req.params.contributorId;
			let contributorName = await Contributor.findOne({_id: contributorId});
			contributorName = contributorName.name;
			const updateName = req.body.name !== contributorName;
			const contributor = await Contributor.findOneAndUpdate(
				{_id: contributorId},
				contributorHelpers.updateSocialLinks(req.body),
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
				contributor: contributorHelpers.stripSocialLinks(contributor),
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
			console.log('revoke  tokens');
			// revokeToken();
			console.log(refreshTokens);
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
			const realAdminUid = config.authentication.superUser;
			const currUser = await User.findById(req.userId);
			const permitted = currUser.permission === realAdminUid;
			if(permitted){
				const pw = req.body.password;
				let contributor = new Contributor();
				await contributor.createContributor({name: req.body.contributorName});
				contributor.save(async (err, contrib) => {
					if(err) {
						res.status(400).send({
							error: 'Contributor name already in use',
							details: err
						});
					}
					else {
						let user = new User();
						const referenceId = contrib._id;
						await user.createUser({...req.body, contributorId: referenceId});
						await user.hashPassword(pw);
						user.save(async (err, saved) => {
							if(err) {
								res.status(400).send({
									error: 'Email already in use.'
								});
							}
							else {
								await sendResetPwEmail(user, contrib);
								res.status(200).send({
									message: `User ${user.email} was created`,
									user: saved,
									contributor: contrib
								});
							}
						});
					}
				});
				return;
			}
			
			res.status(400).send({
				error: 'Current User permissions are not allowed to perform this action.'
			});
		
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
		if(!req.body.email.trim() || !req.body.password.trim()) {
			return res.status(403).send({
				message: 'Please enter valid credentials'
			});
		}
		passport.authenticate('local', (err, user, info) => {			
			if (err) {
				return res.status(404).json(err);
			}
			if (user) {
				// console.log(user);
				const token = user.generateToken();
				const refreshToken = randomToken.uid(256);
				refreshTokens[refreshToken] = user.email;
				res.status(200).send({
					'token': token,
					'refreshToken': refreshToken,
					'user': {_id: user._id, email: user.email, contributorId: user.contributorId, permission: user.permission}
				});
			} else {
				console.log('ANOTHER ERROR');
				console.log(info);
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