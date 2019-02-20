
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let articleSchema = new Schema({
  title: String,
  author: String,
  body: String,
  category: String,
  articleImage: String,
  thumbnailTitle: String,
  thumbNailDescription: String,
  comments: [{body: String, date: Date, user: String}],
  meta: {
    votes: Number,
    favs: Number
  }
})

module.exports = mongoose.model('Blog', articleSchema);
