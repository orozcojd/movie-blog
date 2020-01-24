const { User, Contributor, Review, Post, ReviewStatus } = require('../models');
const url = require('url');

module.exports = {
	/**
   * GET REQUEST
   * Tets all posts and limits to 12 posts. send array of articles
   * If no error -- otherwise sends 400 error
   * @param {Object} req
   * @param {Object} res
   */
	async index (req, res) {
		try {
			const options = {};
			const queryObject = url.parse(req.url, true).query;
			const query = { ...queryObject,
				contributorId: req.body.contributorId };
			if (req.query.skip)
				options.skip = parseInt(req.query.skip);
			if (req.query.limit)
				options.limit = parseInt(req.query.limit);
			options.sort = { created_at: 'desc' };
			const articles = await Post.find(query, {}, options).lean();
			res.send(articles);
		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'An error has occurred trying to get articles',
			});
		}
	},
	/**
	 * GET REQUEST
	 * If user requesting article for edit is contributor, then sends article
	 * otherwise sends 403 error.
	 * @param {Object} req
	 * @param {Object} res
	 */
	async fetchArticle (req, res) {
		try {
			if (!req.params.articleId)
				return res.status(422).json({ message: 'Invalid Article identifier.' });
			const user = await User.findById(req.userId);
			const article = await Post.findById(req.params.articleId).lean();
			const isNotArticleContr = user.contributorId !== article.contributorId;
			if (isNotArticleContr)
				return res.status(403).send({
					error: 'You are unauthorized to make changes to this account!',
				});
			const review = await Review.findOne({ postId: article._id }).lean();
			res.status(200).send({ ...article,
				review });
		} catch (err) {
			res.status(400).send({
				error: 'An error has occurred trying to get articles',
			});
		}
	},
	async reviewArticle (req, res) {
		try {
			const review = await Review.findById(req.params.id).lean();
			if (!review) return res.status(404).send({ error: 'The article requested cannot be found.' });
			const article = await Post.findById(review.postId).lean();
			// const isReviewer = review.currReviewer === req.body.contributorId;
			// const inReview = article.status === ReviewStatus.inReview;
			// if (isReviewer && inReview) res.status(200).send({ ...article,
			// 	review });
			res.status(200).send({ ...article,
				review });
		} catch (err) {
			// console.log(err);
			res.status(400).send({
				error: 'An error has occurred trying to get article for review',
			});
		}
	},
	async reviewArticles (req, res) {
		try {
			const query = url.parse(req.url, true).query;
			const status = query.status;
			const review = query.review ? query.review : 'false';
			const reviewer = query.reviewer ? query.reviewer : 'false';
			let conditions = [];
			let lookup = {};
			switch (status) {
			case ReviewStatus.editing:
				conditions = [ { $eq: [ '$contributorId', req.body.contributorId ] }, { $eq: [ '$status', status ] } ];
				break;
			case ReviewStatus.inReview:
				conditions = [ { $eq: [ '$status', status ] } ];
				if (JSON.parse(reviewer))
					lookup = { $eq: [ '$currReviewer', req.body.contributorId ] };
				else
					lookup = { $eq: [ '$contributorId', req.body.contributorId ] };
				break;
			default:
				// status = ReviewStatus.needsReview;

				if (JSON.parse(review))
					conditions = [ { $ne: [ '$contributorId', req.body.contributorId ] }, { $eq: [ '$status', status ] } ];
				else
					conditions = [ { $eq: [ '$contributorId', req.body.contributorId ] }, { $eq: [ '$status', status ] } ];
				break;
			}
			const posts = await Post.aggregate([
				{
					$match:
						{ $expr:
							{ $and: conditions } },
				},
				{ $addFields: { article_id: { $toString: '$_id' } } },
				{ $lookup: {
					from: 'reviews',
					let: { art_id: '$article_id' },
					pipeline: [
						{ $match:
							{ $expr:
								{ $and:
								[
									{ $eq: [ '$postId', '$$art_id' ] },
									lookup,
								] } } },
					],
					as: 'review',
				} }, { $unwind: '$review' },
				{
					$project: { tags: 0,
						body: 0,
						review: { currReviewer: 0,
							reviewerId: 0,
							contributorId: 0 } },
				},
			]);
			res.send(posts);
		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'An error has occurred trying to get articles for review',
			});
		}
	},
	/**
   * POST REQUEST
   * creates Post article from schema and sends the returned
   * object if no error - otherwise returns 400 error
   * @param {Object} req
   * @param {Object} res
   */
	async postArticle (req, res) {
		try {
			const { status, __type, ...update } = req.body;
			const contributor = await Contributor.findById(req.body.contributorId);
			update.author = contributor.name;
			const article = await Post.create(update);
			await Review.create({ postId: article._id,
				contributorId: req.body.contributorId });
			res.send({
				article,
				message: 'Article was created!',
			});
		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'An error has occurred trying to create articles',
			});
		}
	},
	/**
   * PUT REQUEST
   * Updates article by id and sends the returned response if valid --
   * otherwise sends 400 error
   * @param {Object} req
   * @param {Object} res
   */
	async update (req, res) {
		try {

			// find contributor name and update article content
			const contributor = await Contributor.findOne({
				_id: req.body.contributorId,
			}).lean();
			req.body.author = contributor.name;
			req.body.status = 'NR';

			if (req.body.draft) req.body.status = 'DR';
			const { __type, ...update } = req.body;
			const article = await Post.findOneAndUpdate(
				{ contributorId: req.body.contributorId,
					_id: req.params.articleId },
				update,
				{ new: true }
			);
			if (article) res.send({
				article,
				message: 'Article was updated!',
			});
			else res.status(404).send({
				error: 'Oops! The article you are trying to update does not exist.',
			});

		} catch (err) {
			res.status(400).send({
				error: 'An error has occurred trying to update the article',
			});
		}
	},
	/**
   * DELETE
   * Deletes article from db based on id passed in if record found
   * returns respse containing count of items deleted
   * @param {Object} req
   * @param {Object} res
   */
	async delete (req, res) {
		try {
			const deleteCount = await Post.deleteOne({
				_id: req.params.articleId,
				contributorId: req.body.contributorId,
			});
			if (!deleteCount.n)
				res.status(404).send({
					error: 'Oops! The article you are trying to delete does not exist.',
				});
			else
				res.send({
					deleteCount,
					id: req.params.articleId,
				});

		} catch (err) {
			res.status(400).send({
				error: 'An error has occurred trying to delete the article',
			});
		}
	},
};