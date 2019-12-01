/**
 * Schema for an Article
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const STATUS = [ 'AP', 'IR', 'NR', 'ED', 'DR' ];

const articleSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
		lowercase: true,
	},
	body: {
		type: String,
		default: '',
	},
	draft: {
		type: Boolean,
		default: false,
	},
	realm: {
		type: String,
		required: true,
	},
	tags: [ String ],
	lazyImg: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
	},
	imgCred: {
		type: String,
		required: true,
	},
	thumbnailDescription: {
		type: String,
		default: '',
	},
	contributorId: {
		type: String,
		required: true,
	},
	revId: {
		type: String,
	},
	status: {
		type: String,
		default: 'NR',
		enum: STATUS,
	},
	__type: {
		type: String,
		default: 'Post',
	},
}, { timestamps: { createdAt: 'created_at' } });
articleSchema.methods.updateStatus = async function (status) {
	this.status = status;
};
module.exports = mongoose.model('Blog', articleSchema);
