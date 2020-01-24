/* eslint-disable no-undef */
const axios = require('axios');
const { Post, Review, ReviewStatus } = require('../../models');


module.exports = {
	getReviewSchema ({ contributorId, postId, currReviewer = null }) {
		return {
			currReviewer,
			reviewerId: [],
			postId,
			contributorId,
			__v: 0,
		};
	},
	async updateReview ({ contributorId, postId, currReviewer = null,
		status = ReviewStatus.needsReview }) {
		return await Review.findOneAndUpdate({ contributorId,
			postId },
		status);
	},
};