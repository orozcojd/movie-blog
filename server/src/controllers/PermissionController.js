const {Permissions} = require('../models');

module.exports = {
	async getPermissions (req, res) {
		try {
			const permissions = await Permissions.find();
			res.status(200).send(permissions);
		} catch (e) {
			console.log(e);
			res.status(400).send({
				error: 'An error has occured trying to get permissions',
			});
		}
	},
	async addPermissions (req, res) {
		try {
			const permissions = await Permissions.create(req.body);
			res.status(200).send({permissions: permissions});
		} catch (e) {
			res.status(400).send({
				error: 'Most likely, permission already exists.',
			});
		}
	},
	async updatePermissions (req, res) {
		try {
			const permissions = await Permissions.findByIdAndUpdate(
				req.body._id,
				req.body,
				{new: true}
			);
			res.status(200).send({permissions: permissions});
		} catch (e) {
			console.log(e);
			res.status(400).send({
				error: 'An error has occured trying to get articles',
			});
		}
	}
};