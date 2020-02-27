/**
 * Schema for an Article
 */
const mongoose = require('mongoose');
const Status = require('./ReviewStatus');
const { tagSchema, Tags } = require('./Tags');

const Schema = mongoose.Schema;
const status = [ Status.approved, Status.editing,
	Status.inReview, Status.needsReview, Status.draft ];

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
	// draft: {
	// 	type: Boolean,
	// 	default: false,
	// },
	realm: {
		type: Schema.Types.ObjectId,
		ref: Tags,
		required: true,
	},
	tags: [ { type: Schema.Types.ObjectId,
		ref: Tags } ],
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
	// revId: {
	// 	type: String,
	// },
	status: {
		type: String,
		default: Status.needsReview,
		enum: status,
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
