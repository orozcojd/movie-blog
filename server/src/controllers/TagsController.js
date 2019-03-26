const {Tags} = require('../models');

module.exports = {
	/**
   * GET REQUEST
   * Gets all tag names in db and returns array of tags
   * @param {Object} req 
   * @param {Object} res 
   */
	async getTags (req, res) {
		try {
			const tags = await Tags.find();
			// console.log(tags)
			res.send(tags);
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
   * Adds tags in req to db returning result
   * @param {Object} req 
   * @param {Object} res 
   */
	async addTags (req, res) {
		try {
			let tags = [];
			for(let i = 0; i< req.body.length; i++) {
				let tag = await Tags.create(req.body[i]);
				tags.push(tag);
			}
			res.send(tags);
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to add tags',
				details: err
			});
		}
	},
	async deleteTags (req, res) {
		try {
			let tags = [];
			for(let i = 0; i< req.body.length; i++) {
				let tag = await Tags.deleteOne({
					_id: req.body[i]._id
				});
				tags.push({
					deleteCount: tag.n,
					id: req.body[i]._id
				});
			}
			let reducer = (accumulate, currentVal) => ({deleteCount: accumulate.deleteCount + currentVal.deleteCount});
			res.send(tags.reduce(reducer));
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to add tags',
				details: err
			});
		}
	},
};