const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let realmSchema = new Schema({
	ref_id: {
		type: String,
		unique: true,
	}
});
module.exports = mongoose.model('Realms', realmSchema);
