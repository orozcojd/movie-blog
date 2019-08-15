/**
 * Schema for an Article  
 */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	body: String,
	draft: {
		type: Boolean,
		default: false
	},
	realm: {
		type: String,
		required: true
	},
	tags: [String],
	lazyImg: {
		type: String,
		required: true
	},
	img: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	},
	imgCred: String,
	thumbnailDescription: String,
	contributorId: {
		type: String,
		required: true
	},
	comments: [{body: String, date: Date, user: String}],
	meta: {
		votes: Number,
		favs: Number
	}
}, {timestamps: { createdAt: 'created_at'} });
module.exports = mongoose.model('Blog', articleSchema);
