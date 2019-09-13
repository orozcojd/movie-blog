const {Tags} = require('../models');
const {sortAlpha} = require('../helpers/Helpers');
module.exports = {
	/**
   * GET REQUEST
   * Gets all tag names in db and returns array of tags
	 * if optional query passed in, applies it to search
   * @param {Object} req 
   * @param {Object} res 
   */
	async getTags (req, res) {
		try {
			const tags = await Tags.find(
				req.query
			);
			res.send(tags.sort(sortAlpha()));
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get tags',
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
			res.send({
				tags: tags,
				message: 'Your new tags were added!'
			});

		}
		catch (err) {
			let error = 'An error has occured trying to add tags';
			if(err.code === 11000) {
				error = 'Tag already exists! Please check existing tag names.';
			}
			res.status(400).send({
				error: error,
			});
		}
	},
	/**
   * PUT REQUEST
   * Updates array of tags by id in tag object and sends the returned 
	 * response if valid -- otherwise sends 400 error 
   * @param {Object} req 
   * @param {Object} res 
   */
	async update (req, res) {
		try {
			let tags = req.body;
			let updated = [];
			for(let i = 0; i< tags.length; i++) {
				let tag = tags[i];
				const updatedTag = await Tags.findByIdAndUpdate(
					tag._id,
					tag,
					{new: true}
				);
				updated.push(updatedTag);
			}
			res.send({
				tags: updated,
				message: 'Your tag edits were saved!'
			});
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to update the tag',
			});
		}
	},
	async deleteTags (req, res) {
		try {
			let tags = [];
			const data = req.body.tags;
			for(let i = 0; i< data.length; i++) {
				let tag = await Tags.deleteOne({
					_id: data[i]._id
				});
				tags.push({
					deleteCount: tag.n,
					id: data[i]._id
				});
			}
			let reducer = (accumulate, currentVal) => ({deleteCount: accumulate.deleteCount + currentVal.deleteCount});
			res.send(tags.reduce(reducer));
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to add tags',
			});
		}
	},
};