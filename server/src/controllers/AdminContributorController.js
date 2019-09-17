let {Contributor} = require('../models');
const contributorHelpers = require('../helpers/Contributor');


module.exports = {

	async getContributor (req, res) {
		const id = req.params.contributorId;
		try {
			const contributor = await Contributor.findOne({_id: id});
			if(contributor) {
				res.send(contributorHelpers.stripSocialLinks(contributor));
			}
			else {
				res.status(404).send({
					error: 'The resource is not found'
				});
			}
		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'Unexpected error has occurred'
			});
		}
	},
	/**
	 * PUT REQUEST
	 * Updates the contributor info in the db and returns the updated Model
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async updateContributor (req, res) {
		try {
			console.log('updateContributor');
			const contributorId = req.params.contributorId;
			let contributorName = await Contributor.findOne({_id: contributorId});
			contributorName = contributorName.name;
			const updateName = req.body.name !== contributorName;
			const contributor = await Contributor.findOneAndUpdate(
				{_id: contributorId},
				contributorHelpers.updateSocialLinks(req.body),
				{new: true}
			);
			let updated;
			if(updateName) {
				updated = await Post.updateMany({contributorId: contributorId}, {
					author: req.body.name
				});
			}
			let message = 'Contributor information Updated! ';
			if(updated) {
				message += updated.nModified.toString() + ' Article(s) were updated reflecting name change.';
			}
			res.send({
				contributor: contributorHelpers.stripSocialLinks(contributor),
				message: message
			});

		} catch(err) {
			res.status(400).send({
				error: 'Unexpected error has occurred'
			});
		}

	}
};