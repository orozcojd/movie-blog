const {Review, Post} = require('../models');
// Review.find().remove().exec();
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
		} catch(err) {
			res.status(400).send({
				error: 'Unexpected error occurred trying to get reviews'
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
			if(isCreator) err = 'You cant claim your own article for review.';
			else if(!needsReview) err = 'Only Articles that need review can be claimed.';
			
			else {
				review = await Review.findOneAndUpdate(
					{_id: req.params.revId},
					{
						$push: {reviewerId: curUID},
						currReviewer: curUID
					},
					{new: true}
				);
				article.updateStatus('IR');
				article.save((err, saved) => {
					if(err) {
						return res.status(403).send({
							error: 'An error occurred claiming article for review..'
						});
					}
				});
				return res.send(review);
			}
			console.log(err);
			return res.status(403).send({
				error: err
			});

		} catch(err) {
			console.log(err);
			res.status(400).send({
				error: 'Unexpected error occurred trying to claim article for review'
			});
		}
	}
};