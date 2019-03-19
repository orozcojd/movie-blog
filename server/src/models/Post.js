/* 
  Schema for an Article  
*/
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articleSchema = new Schema({
	title: String,
	author: String,
	body: String,
	draft: {
		type: Boolean,
		default: false
	},
	category: String,
	tags: [String],
	img: String,
	thumbnailDescription: String,
	comments: [{body: String, date: Date, user: String}],
	meta: {
		votes: Number,
		favs: Number
	},
}, {timestamps: { createdAt: 'created_at'} });
module.exports = mongoose.model('Blog', articleSchema);
