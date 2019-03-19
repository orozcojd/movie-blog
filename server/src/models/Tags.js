const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tagSchema = new Schema({
	name: { type: String, unique: true }
});
module.exports = mongoose.model('Tags', tagSchema);
