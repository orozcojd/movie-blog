const {Realms} = require('../models');
// Realms.find().remove().exec();
// Realms.collection.dropIndexes(function (err, results) {
// });
module.exports = {
	/**
   * GET REQUEST
   * Gets all realm names in db and returns array of realms
   * @param {Object} req 
   * @param {Object} res 
   */
	async getRealms (req, res) {
		try {
			const realms = await Realms.find();
			res.send(realms);
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get tags',
				details: err
			});
		}
	},
	/**
   * POST REQUEST
   * Adds realms in req to db returning result
   * @param {Object} req 
   * @param {Object} res 
   */
	async addRealms (req, res) {
		try {
			let realms = [];
			for(let i = 0; i< req.body.length; i++) {
				let realm = await Realms.create(req.body[i]);
				realms.push(realm);
			}
			res.send(realms);
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to add realms',
				details: err
			});
		}
	},

};