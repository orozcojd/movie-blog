const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const config = require('../config/config');
const permissions = [config.authentication.AdminUser, config.authentication.superUser];

const PermissionSchema = new Schema({
	level: {
		type: Number,
		required: true,
		enum: permissions,
		default: config.authentication.AdminUser
	},
	name: {
		type: String,
		required: true,
		unique: true
	}
});

module.exports = mongoose.model('Permission', PermissionSchema);