const mongoose = require('mongoose');
let Schema = mongoose.Schema;


const ContributorSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	img: String,
	bio: String,
	twitter: String,
	instagram: String
});

ContributorSchema.methods.createContributor = async function(contributor) {
	this.name = contributor.name;
	this.img = contributor.img;
	this.bio = contributor.bio;
	this.twitter = contributor.twitter;
	this.instagram = contributor.instagram;
};


module.exports = mongoose.model('Contributor', ContributorSchema);