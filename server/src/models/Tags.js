const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tagSchema = new Schema({
	name: { 
		type: String,
		unique: true,
		set: v => v.toLowerCase().split(' ').join('-'),
		get: v => v.toLowerCase().split(' ').join('-')
	}
});
module.exports = mongoose.model('Tags', tagSchema);
