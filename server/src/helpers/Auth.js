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
		if(verifyUser && verifyUser.contributorId !== contributorId) {
			return false;
		}
		return true;
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
	}
};