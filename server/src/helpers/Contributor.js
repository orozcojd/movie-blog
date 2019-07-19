module.exports = {
	updateSocialLinks(body) {
		body.twitter = body.twitter ? `https://www.twitter.com/${body.twitter}` : null;
		body.facebook = body.facebook ? `https://www.facebook.com/${body.facebook}` : null;
		body.instagram = body.instagram ? `https://www.instagram.com/${body.instagram}` : null;
		console.log(body);
		return body;
	},
	stripSocialLinks(body) {

		console.log(body);
		console.log('BEFORE');
		body.twitter = body.twitter ? body.twitter.split('/')[3] : null;
		body.facebook = body.facebook ? body.facebook.split('/')[3] : null;
		body.instagram = body.instagram ? body.instagram.split('/')[3] : null;
		console.log(body);
		return body;
	}
};