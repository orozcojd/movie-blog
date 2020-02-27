const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
	name: {
		type: String,
		unique: true,
		lowercase: true,
		required: true,
	},
	urlTag: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	img: {
		type: String,
		default: null,
	},
	lazyImg: {
		type: String,
		default: null,
	},
	realm: {
		type: Boolean,
		default: false,
	},
	__type: {
		type: String,
		default: 'Tag',
	},
	prev: {
		type: String,
		default: null,
	},
	contributorId: {
		type: String,
		required: true,
	},
});
module.exports = {
	Tags: mongoose.model('Tags', tagSchema),
	tagSchema,
};
