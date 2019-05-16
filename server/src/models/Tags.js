const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tagSchema = new Schema({
	name: {
		type: String,
		unique: true,
		set: v => v.toLowerCase().trim(),
		// get: v => v.toLowerCase()
	},
	img: {
		type: String,
		default: null
	},
	realm: {
		type: Boolean,
		default: false
	}
});
module.exports = mongoose.model('Tags', tagSchema);
