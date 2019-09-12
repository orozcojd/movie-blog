const {Permissions} = require('../models');
let {User} = require('../models');

module.exports = {
	async checkCreatorPermissions(req, res, next) {
		const loggedInUser = await User.findById(req.userId);
		const currUserPermission = loggedInUser;
		const permissions = await Permissions.find();
		const creator = permissions.find(p => {
			return p.name === 'CREATOR';
		});
		const isAuthorized = currUserPermission.permission === creator._id.toString();
		if(isAuthorized) next();
		else {
			res.status(403).send({
				error: 'Your permission level prohibits you from doing this action!'
			});
		}
	},
	async validatePermissions(req, res, next) {
		const permissions = await Permissions.find();
		const permission = permissions.find(p => {
			return p._id.toString() === req.body.permission;
		});
		if(!permission) res.status(404).send({error: 'Inavlid permission id.'});
		else next();
	}
};