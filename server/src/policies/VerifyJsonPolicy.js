module.exports = {
	verifyJson (req, res, next) {
		try {
			// console.log(req.method);
			// Check if request payload content-type matches json, because body-parser does not check for content types
			if (!req.is('json') && [ 'POST', 'PUT' ].includes(req.method))
				return res.status(415).send({
					error: 'Unsupported media type',
				}); // -> Unsupported media type if request doesn't have JSON body

			next();

		} catch (err) {
			return res.status(500).send({
				error: 'Something went wrong on our end...',
			});
		}
	},
};