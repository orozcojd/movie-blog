const { Post, ReviewStatus, Tags } = require('../models');
// Post.find().remove().exec();
// Tags.collection.dropAllIndexes(function (err, results) {
// });
module.exports = {

	root (req, res) {
		res.send('Hello! You just conneted to the API!');
	},
	/**
   * GET REQUEST
   * Gets all posts and limits to 12 posts. send array of articles
   * If no error -- otherwise sends 400 error
   * @param {Object} req
   * @param {Object} res
   */
	async index (req, res) {
		try {
			const options = {};
			let trimArticle = {};
			if (req.query.skip)
				options.skip = parseInt(req.query.skip);
			if (req.query.limit)
				options.limit = parseInt(req.query.limit);
			options.sort = { created_at: 'desc' };
			const query = {};
			query.status = 'AP';
			trimArticle = { title: 1,
				author: 1,
				img: 1,
				updatedAt: 1,
				thumbnailDescription: 1 };
			const articles = await Post.find(query, trimArticle, options).lean();
			res.send(articles);
		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get articles',
			});
		}
	},

	/**
   * GET REQUEST BY ID
   * Finds the article by id and sends the reponse if id is valid
   * otherwise sends 400 error
   * @param {Object} req
   * @param {Object} res
   */
	async articlesById (req, res) {
		try {
			// console.log(await Tags.find;())
			const article = await Post.findOne({
				_id: req.params.articleId,
				status: ReviewStatus.approved,
			}, '-status')
				.populate({
					path: 'realm',
					select: '-contributorId',
				})
				.populate({
					path: 'tags',
					select: '-contributorId',
				})
				.lean();
			if (article)
				res.send(article);
				// console.log('article');
				// console.log(article);
			else
				res.status(404).send({
					error: 'Article was not found.',
				});

		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get articles',
			});
		}
	},
	/**
   * GET REQUEST
   * Gets all posts by tag name (tag) and limits to 12 posts.
   * Send array of articles if no error -- otherwise sends 400 error
   * @param {Object} req
   * @param {Object} res
   */
	async articlesByTag (req, res) {
		try {
			// console.log(req.query);
			const size = 12;
			let trimArticle = {};
			let pageNo = parseInt(req.query.page);
			const query = {};
			pageNo = pageNo >= 0 ? pageNo : 1;
			const count = await Post.countDocuments({ $or: [ { tags: req.params.tagName }, { realm: req.params.tagName } ] });
			query.skip = size * (pageNo - 1);
			query.limit = size;
			query.sort = { created_at: 'desc' };
			trimArticle = { title: 1,
				author: 1,
				img: 1,
				thumbnailDescription: 1 };
			const articles = await Post
				.find({
					$or: [ { tags: req.params.tagName }, { realm: req.params.tagName } ],
				}, trimArticle, query)
				.populate({
					path: 'realm',
					select: '-contributorId',
				})
				.populate({
					path: 'tags',
					select: '-contributorId',
				})
				.lean();
			const response = {
				message: articles,
				pages: Math.ceil(count / size),
				pageNo,
			};
			console.log(response);
			res.send(response);
		} catch (err) {
			console.log(err);
			res.status(400).send({
				error: 'An error has occured trying to get article tag',
			});
		}
	},
	async articlesByContributor (req, res) {
		try {
			const size = 12;
			let trimArticle = {};
			let pageNo = parseInt(req.query.page);
			const query = {};
			pageNo = pageNo >= 0 ? pageNo : 1;

			const count = await Post.countDocuments({ contributorId: req.params.contributorId });
			query.skip = size * (pageNo - 1);
			query.limit = size;
			query.sort = { created_at: 'desc' };
			trimArticle = { title: 1,
				author: 1,
				img: 1,
				thumbnailDescription: 1 };
			const articles = await Post.find({
				contributorId: req.params.contributorId,
			}, trimArticle, query).lean();

			const response = {
				message: articles,
				pages: Math.ceil(count / size),
				pageNo,
			};
			res.send(response);

		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get associated articles',
			});
		}
	},
	/**
	 * Gets associated articles by TAG or REALM otherwise sends latest
	 * articles sorted by created_at
	 * articles
	 * @param {Object} req
	 * @param {Object} res
	 */
	async associatedArticles (req, res) {
		try {
			const pageNo = isNaN(req.query.pageNo) ? 1 : req.query.pageNo;
			const currId = req.query.id;
			const size = 5;
			const options = {};
			const query = {};
			query.draft = false;
			options.skip = size * (pageNo - 1);
			options.limit = size;

			options.sort = { created_at: 'desc' };
			if (req.query.latestUnrelated === 'true')
				query.$and = [
					{ realm: { $nin: req.query.relatedTags } },
					{ tags: { $nin: req.query.relatedTags } },
					{ _id: { $ne: currId } },
				];

			else {
				const tags = req.query.relatedTags;
				query.$and = [
					{ $or: [ { realm: { $in: tags } }, { tags: { $in: tags } } ] },
					{ $or: [ { _id: { $ne: currId } } ] },
				];
			}
			const article = await Post
				.find(query, {}, options).lean();
			const response = {
				message: article,
				pageNo,
			};
			res.send(response);
		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get associated articles',
			});
		}
	},
};