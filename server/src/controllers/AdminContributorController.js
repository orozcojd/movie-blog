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

};