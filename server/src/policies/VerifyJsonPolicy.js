module.exports = {
	verifyJson(req, res, next) {
		// Check if request payload content-type matches json, because body-parser does not check for content types
		if (!req.is('json')) {
			return res.status(415).send({
				'error': 'Unsupported media type'
			}); // -> Unsupported media type if request doesn't have JSON body
		}
		else {
			next();
		}
	}
};