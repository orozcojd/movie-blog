const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	hash: String,
	permission: {
		type: Number,
		default: 2
	},
	contributorName: {
		type: String,
		required: true,
		unique: true
	}
});

UserSchema.methods.createUser = async function(user) {
	this.email = user.email;
	this.permission = user.permission;
	this.contributorName = user.contributorName;
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
	return jwt.sign({
		_id: this._id,
		email: this.email,
		exp: parseInt(expiry.getTime() / 1000)
	},
	config.authentication.jwtSecret);
};


module.exports = mongoose.model('User', UserSchema);
