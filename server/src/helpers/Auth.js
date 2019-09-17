let {User} = require('../models');
// let {Contributor} = require('../models');

module.exports = {
	/**
   * Given the userId from the token request, cross-validates
   * the contributorId from from the user in db to the contributorId
   * in the request - returns true if valid otherwise false
   * @param {Object} req 
   */
	async authenticateRequest (req) {
		const contributorId = req.body.contributorId;
		const verifyUser = await User.findById(req.userId);
		console.log(verifyUser);
		console.log(contributorId);
		if(verifyUser) {	
			const isArticleContributor = (verifyUser.contributorId === contributorId);
			const isAdminContributor = (verifyUser.contributorId === req.body.id);
			if(isAdminContributor || isArticleContributor) {
				return true;
			}
		}
		return false;
	},
	/**
   * Given the userId from the token request, verifies a valid user and returns true
   * otherwise returns false
   * @param {Object} req 
   */
	async authenticateTokenUser (req) {
		const verifyUser = await User.findById(req.userId);
		if(!verifyUser) {
			return false;
		}
		return true;
	},
	getTokenRequest(req) {
		let token = null;
		if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
			token = req.headers.authorization.split(' ')[1];
		}
		else if(req.query && req.query.token){
			token = req.query.token;
		}
		return token;
	}
};