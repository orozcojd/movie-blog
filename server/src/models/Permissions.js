const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const PermissionSchema = new Schema({
	level: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	__type: {
		type: String,
		default: 'Permission'
	}
});

module.exports = mongoose.model('Permission', PermissionSchema);