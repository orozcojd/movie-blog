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
		required: true,
		lowercase: true
	},
	body: {
		type: String,
		default: ''
	},
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
	imgCred: {
		type: String,
		required: true
	},
	thumbnailDescription: {
		type: String,
		default: ''
	},
	contributorId: {
		type: String,
		required: true
	},
	comments: [{body: String, date: Date, user: String}],
	meta: {
		votes: Number,
		favs: Number
	},
	__type: {
		type: String,
		default: 'Post'
	}
}, {timestamps: { createdAt: 'created_at'} });
module.exports = mongoose.model('Blog', articleSchema);
