const {Contributor} = require('../models');

module.exports = {
	/**
	 * GET REQUEST
	 * Given the contributor id in the req params, returns the contributor model
	 * if found otherwise a 404 response
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async getContributor (req, res) {
		const id = req.params.contributorId;
		try {
			const contributor = await Contributor.findOne({_id: id});
			if(contributor) {
				// console.log(contributor);
				res.send(contributor);
			}
			else {
				console.log('inside else');
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
	 * Finds all contributors and returns the array in the response
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async contributors(req, res) {
		try {
			const contributors = await Contributor.find().lean();
			res.send(contributors);
		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get contributors',
			});
		}
	},
};