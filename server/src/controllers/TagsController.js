const { Tags, Post } = require('../models');
const { sortAlpha } = require('../helpers/Helpers');

module.exports = {

	async getTag (req, res) {
		try {
			const tag = await Tags.findOne(
				{ urlTag: req.params.tagName }
			).lean();
			res.send({
				tag,
				exists: !!tag,
			});
		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get tags',
			});
		}
	},

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
			).lean();
			res.send(tags.map(tag => ({ ...tag,
				__type: 'Tag' })).sort(sortAlpha()));
		} catch (err) {
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
			const tags = [];
			for (let i = 0; i < req.body.length; i++) {
				// should probably validate if tag exists
				const tag = await Tags.create(req.body[i]);
				tags.push(tag);
			}
			res.send({
				tags,
				message: 'Your new tags were added!',
			});

		} catch (err) {
			let error = 'An error has occured trying to add tags';
			if (err.code === 11000)
				error = 'Tag already exists! Please check existing tag names.';

			res.status(400).send({
				error,
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
			const tags = req.body;
			const updated = [];
			let updatedTag;
			let updateArticle;
			// let modifiedPosts = 0;
			// await Tags.updateMany({}, {"$set": {"prev": urlTag.$}});
			for (let i = 0; i < tags.length; i++) {
				const prev = tags[i].prev;
				const urlTag = tags[i].name.split(' ').join('-');
				const tag = { ...tags[i],
					urlTag,
					prev: urlTag }; /* set urlTag and prev */

				updatedTag = await Tags.findByIdAndUpdate(
					tag._id,
					tag,
					{ new: true }
				);
				updated.push(updatedTag);
				updateArticle = await Post.updateMany({ tags: prev }, {
					$set: { 'tags.$': urlTag },
				});
				// modifiedPosts += updateArticle.nModified;
				updateArticle = await Post.updateMany({ realm: prev }, {
					realm: urlTag,
				});
				// modifiedPosts += updateArticle.nModified;
			}
			console.log(tags);
			res.send({
				tags: updated,
				message: 'Your tag edits were saved!',
			});
		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to update the tag',
			});
		}
	},
	async deleteTags (req, res) {
		try {
			const tags = [];
			const data = req.body.tags;
			const rejected = [];
			console.log(data);
			for (let i = 0; i < data.length; i++) {
				// search for tags in posts - cant delete
				const inPost = await Post.countDocuments({ $or: [ { realm: data[i].urlTag }, { tags: data[i].urlTag } ] });
				if (inPost > 0) rejected.push(data[i].name);
				else {
					const tag = await Tags.deleteOne({
						_id: data[i]._id,
					});
					tags.push({
						deleteCount: tag.n,
						id: data[i].urlTag,
					});
				}
			}
			console.log(tags);
			const reducer = (accumulate, currentVal) => ({ deleteCount: accumulate.deleteCount + currentVal.deleteCount });
			res.send({
				deleted: {
					exists: !!tags.length,
					tags: tags.map(tag => tag.id),
					count: tags.length ? tags.reduce(reducer) : null,
				},
				rejected: {
					error: !!rejected.length,
					message: `The following tags exist in article and could not be deleted: ${ JSON.stringify(rejected) }`,
				},
			});
			// res.send(tags);
		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'An error has occured trying to delete tags',
			});
		}
	},
};