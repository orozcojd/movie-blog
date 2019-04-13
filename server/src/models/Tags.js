const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tagSchema = new Schema({
	name: {
		type: String,
		unique: true,
		set: v => v.toLowerCase().split(' ').join('-'),
		get: v => v.toLowerCase().split(' ').join('-')
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
