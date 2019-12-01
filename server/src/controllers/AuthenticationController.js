// controllers are used for declaring all the endpoints
const { User } = require('../models');
const { Contributor } = require('../models');
const { Permissions } = require('../models');
const { Post } = require('../models');
// const nodemailer = require('nodemailer');
const { sendResetPwEmail } = require('../services/MailService');
const config = require('../config/config');
const passport = require('passport');
const randomToken = require('rand-token');
// const helpers = require('../helpers/Auth');
const contributorHelpers = require('../helpers/Contributor');


const refreshTokens = [];
// Post.find().remove().exec();
// User.find({
// }).remove().exec();

const rules = [
	{
		actions: [ 'read' ],
		subject: 'all',
	},
	{
		actions: [ 'update', 'delete' ],
		subject: 'Post',
		conditions: {
			contributorId: '${user.contributorId}',
		},
	},
	{
		actions: [ 'create', 'read', 'update', 'delete' ],
		subject: 'Post',
		conditions: {
			user: '${user}',
		},
	},
];
const user = {
	contributorId: 1,
	email: 'sample@gmail.com',
	_id: 2,
	permission: {
		level: 1,
		name: 'CREATOR',
		_id: 1234,
	},
};

module.exports = {

	/**
	 * POST REQUEST
	 * Validates user by comparing hash of user plaintext pw
	 * to hash stored in db returning token and user details if
	 * valid
	 * @param {Object} req
	 * @param {Object} res
	 */
	login (req, res) {
		if (!req.body.email.trim() || !req.body.password.trim())
			return res.status(403).send({
				error: 'Please enter valid credentials',
			});

		passport.authenticate('local', async (err, user, info) => {
			if (err)
				return res.status(404).send({
					error: 'Something went wrong trying to log you in.',
				});

			if (user) {
				const token = user.generateToken();
				const refreshToken = randomToken.uid(256);
				refreshTokens[refreshToken] = user.email;
				// const permission = await Permissions.findById(user.permission);

				res.status(200).send({
					aclRules: rules,
					token,
					refreshToken,
					user: { _id: user._id,
						email: user.email,
						contributorId: user.contributorId },
				});
			} else
				res.status(401).send(info);

		})(req, res);
	},
	/**
	 * POST
	 * If user associated to email in response exists, calls nodemailer to
	 * send email instructions for restarting pasword.
	 * @param {Object} req
	 * @param {Object} res
	 */
	async forgotPassword (req, res) {
		try {
			console.log('inside forgotpassword');
			if (!req.body.email.trim())
				return res.status(400).send({
					error: 'Email is required!',
				});


			const email = req.body.email;
			const user = await User.findOne({ email });
			if (user) {
				const contributor = await Contributor.findById(user.contributorId);
				user.generatePwToken();
				user.save(async err => {
					if (!err)
						await sendResetPwEmail(user, contributor);

				});
			}
			res.status(200).send({ message: 'If your email exists, you will receive instructions to reset your password.' });
		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred trying to reset password',
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
			if (tokenUsed) {
				status = 403;
				error = 'Token has been already used. To reset your password again, please restart the process from the login page.';
			} else {
				await user.hashPassword(req.body.pass);
				user.resetToken = null;
				user.save((err, saved) => {
					if (err) {
						error = err;
						status = 400;
					} else {
						// successful block
						const token = user.generateToken();
						const refreshToken = randomToken.uid(256);
						refreshTokens[refreshToken] = user.email;
						const response = {
							message: 'Your password has been successfully updated.',
							token,
							refreshToken,
							user: { _id: user._id,
								email: user.email,
								contributorId: user.contributorId,
								permission: user.permission },
						};
						res.status(200).send(response);
					}
				});
				return; // needed so headers aren't overwritten
			}
			// send error case
			res.status(status).send({ error });
		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'Unexpected error has occurred trying to reset password.',
			});
		}
	},
	async getFullUser (req, res) {
		try {
			const user = await User.findById(req.userId).lean();
			const permission = await Permissions.findById(user.permission);
			const aclUser = { _id: user._id,
				email: user.email,
				contributorId: user.contributorId,
				permission };
			res.status(200).send({ aclUser,
				aclRules: rules });
		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred trying to get user permission info',
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
			// console.log(contributor);
			res.status(200).send({ name: contributor.name });

		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred trying to get contributor information',
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
				error: 'Unexpected error has occurred',
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
			const pw = req.body.password;
			const contributor = new Contributor();
			await contributor.createContributor({ name: req.body.contributorName });
			contributor.save(async (err, contrib) => {
				if (err)
					res.status(400).send({
						error: 'Contributor name already in use',
					});

				else {
					const user = new User();
					const referenceId = contrib._id;
					await user.createUser({ ...req.body,
						contributorId: referenceId });
					await user.hashPassword(pw);
					user.save(async (err, saved) => {
						if (err)
							res.status(400).send({
								error: 'Email already in use.',
							});

						else {
							await sendResetPwEmail(user, contrib);
							res.status(200).send({
								message: `User ${ user.email } was created`,
							});
						}
					});
				}
			});
			return;
			// }

			// res.status(400).send({
			// 	error: 'Current User permissions are not allowed to perform this action.'
			// });

		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred',
			});
		}
	},
	async deleteUser (req, res) {
		try {
			const deleteCount = await User.deleteOne({
				_id: req.params.userId,
			});
			res.send({
				deleteCount,
				id: req.params.userId,
			});
		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred trying to update permission.',

			});
		}
	},

	async updateUserPermission (req, res) {
		try {
			const user = await User.findById(req.body.id);
			user.updatePermission(req.body.permission);
			user.save(async err => {
				if (!err)
					res.status(200).send({ message: 'User permission level updated.' });

			});
		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error has occurred trying to update permission.',

			});
		}
	},
	/**
	 * POST REQUEST
	 * Extracts email and refresh token from body and if valid: responds with new token
	 * otherwise send 401
	 * @param {Object} req
	 * @param {Object} res
	 */
	async refreshToken (req, res) {
		// if (!req.is('json')) {
		// 	return res.sendStatus(415); // -> Unsupported media type if request doesn't have JSON body
		// }
		const email = req.body.email;
		const refreshToken = req.body.refreshToken;
		try {
			if (refreshToken in refreshTokens && refreshTokens[refreshToken] === email)
				await User.findOne({ email }, (err, user) => {
					if (!user)
						res.status(401).send({ error: 'User not found.' });

					else {
						const token = user.generateToken();
						res.status(200).send({ token });
					}
				});

			else
				res.status(401).send({ error: 'Unauthorized! Please log in and try again.' });

		} catch (err) {
			res.status(401).send({
				error: 'Unexpected Error occurred!',
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
		if (refreshToken in refreshTokens)
			delete refreshTokens[refreshToken];

		res.sendStatus(204);
	},
};