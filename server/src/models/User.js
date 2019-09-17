const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	hash: String,
	permission: {
		type: String,
		required: true
	},
	contributorId: {
		type: String,
		required: true,
		unique: true
	},
	token: {
		type: String,
		required:  false
	},
	resetToken: {
		type: String,
		required: false,
		default: null
	},
	__type: {
		type: String,
		default: 'User'
	}
});

UserSchema.methods.createUser = async function(user) {
	this.email = user.email;
	this.permission = user.permission;
	this.contributorId = user.contributorId;
};

UserSchema.methods.hashPassword = async function(password) {
	/**
   * Hashes password using bcrypt and sets user hash
   */
	const SALT_FACTOR = 8;
	await bcrypt
		.genSalt(SALT_FACTOR)
		.then(salt => {
			return bcrypt.hash(password, salt, null);})
		.then(hash => {
			this.hash = hash;
		});
};
UserSchema.methods.updatePermission = async function(permission) {
	this.permission = permission;
};

UserSchema.methods.comparePasswords = async function(password) {
	/**
   * Returns promise of bcrypt compare method
   */
	let match = await bcrypt.compare(password, this.hash, null);
	return match;
};

UserSchema.methods.generateToken = function() {
	let expiry = new Date();
	expiry.setDate(expiry.getDate() + 3);
	// expiry.setSeconds(expiry.getSeconds() + 10);
	return jwt.sign({
		_id: this._id,
		email: this.email,
		exp: parseInt(expiry.getTime() / 1000)
	},
	config.authentication.jwtSecret);
};

UserSchema.methods.generatePwToken = function() {
	let expiry = new Date();
	expiry.setHours(expiry.getHours() + 3);
	const token = jwt.sign({
		_id: this._id,
		exp: parseInt(expiry.getTime() / 1000)
	},
	config.authentication.jwtSecret);
	//save token to model
	jwt.verify(token, config.authentication.jwtSecret, (err, decoded) => {
	});
	this.resetToken = token;
};

module.exports = mongoose.model('User', UserSchema);
