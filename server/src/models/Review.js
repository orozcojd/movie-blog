const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// const STATUS = ['AP', 'IR', 'NR', 'ED', 'DR'];

let reviewSchema = new Schema({
	currReviewer: {
		type: String,
		default: null
	},
	reviewerId: {
		type: [String],
		default: []
	},
	// status: {
	// 	type: String,
	// 	default: 'NR',
	// 	enum: STATUS
	// },
	postId: {
		type: String,
		required: true,
		unique: true
	},
	contributorId: {
		type: String,
		required: true
	},
	comments: {
		type: String
	},
	__type: {
		type: String,
		default: 'Review'
	},
});
module.exports = mongoose.model('Review', reviewSchema);
