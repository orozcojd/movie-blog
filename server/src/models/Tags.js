const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tagSchema = new Schema({
	name: {
		type: String,
		unique: true,
		lowercase: true
	},
	urlTag: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	img: {
		type: String,
		default: null
	},
	lazyImg: {
		type: String,
		default: null
	},
	realm: {
		type: Boolean,
		default: false
	}
});
module.exports = mongoose.model('Tags', tagSchema);
