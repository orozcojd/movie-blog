const { Review, Post } = require('../models');
// Review.find().remove().exec();
// Post.find().remove().exec();
module.exports = {

	/**
   * Gets all reviews from db and sends response array
   * @param {Object} req
   * @param {Object} res
   */
	async getReviews (req, res) {
		try {
			const reviews = await Review.find();
			res.send(reviews);
		} catch (err) {
			res.status(400).send({
				error: 'Unexpected error occurred trying to get reviews',
			});
		}
	},

	async updateRevStatus (req, res) {
		try {
			const error = {};
			console.log(req.body.comments);
			const revId = req.params.revId;
			const currUser = req.body.contributorId;
			const rev = await Review.findById(revId);
			const notAuthorized = rev.currReviewer !== currUser;
			const accept = req.body.accept;
			if (notAuthorized) {
				error.status = 403;
				error.message = 'You are not authorized to update this review';
				error.error = true;
			} else if (typeof accept !== 'boolean') {
				error.status = 400;
				error.message = 'Missing or invalid param [accept]';
				error.error = true;
			}
			if (error.error)
				return res.status(error.status).send({ error: error.message });

			let status;
			if (accept) status = 'AP';
			else status = 'ED';
			const review = await Review.findByIdAndUpdate(revId, { // release current reviewer
				currReviewer: null,
				comments: req.body.comments,
			},
			{ new: true });
			console.log(review);
			await Post.findByIdAndUpdate(review.postId, {
				status,
			}).then(() => res.status(200).send());
			return res.status(400).send({ error: 'Unexpected error occurred trying to update post review' });

		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'Unexpected error occurred trying to update post review',
			});
		}
	},
	async claimArticles (req, res) {
		try {
			const curUID = req.body.contributorId;
			let err;
			let review = await Review.findById(req.params.revId);
			const article = await Post.findById(review.postId);
			const isCreator = article.contributorId === curUID;
			const needsReview = article.status === 'NR';
			if (isCreator) err = 'You cant claim your own article for review.';
			else if (!needsReview) err = 'Only Articles that need review can be claimed.';

			else {
				review = await Review.findOneAndUpdate(
					{ _id: req.params.revId },
					{
						$push: { reviewerId: curUID },
						currReviewer: curUID,
					},
					{ new: true }
				);
				article.updateStatus('IR');
				article.save((err, saved) => {
					if (err)
						return res.status(403).send({
							error: 'An error occurred claiming article for review..',
						});

				});
				return res.send(review);
			}
			console.log(err);
			return res.status(403).send({
				error: err,
			});

		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'Unexpected error occurred trying to claim article for review',
			});
		}
	},
};