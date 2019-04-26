const {Post} = require('../models');

// Post.find().remove().exec();
// Tags.collection.dropAllIndexes(function (err, results) {
// });
module.exports = {
	/**
   * POST REQUEST
   * creates Post article from schema and sends the returned
   * object if no error - otherwise returns 400 error 
   * @param {Object} req 
   * @param {Object} res 
   */
	async postArticle (req, res) {
		try {
			const article = await Post.create(req.body);
			res.send({
				article: article
			});
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to create articles',
				details: err
			});
		}
	},
	/**
   * GET REQUEST
   * Tets all posts and limits to 12 posts. send array of articles
   * If no error -- otherwise sends 400 error 
   * @param {Object} req 
   * @param {Object} res 
   */
	async index (req, res) {
		try {
			let options = req.body;
			console.log(options);
			const articles = await Post
				.find().lean()
				// .limit(12)
				.sort('-created_at');
			res.send(articles);   
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get articles',
				details: err
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
	async getArticlesByTag (req, res) {
		try {
			const size = 12;
			let pageNo = parseInt(req.query.page);
			let query = {};
			if(pageNo <= 0 || isNaN(pageNo)) {
				// set pageNo to 1 if invalid
				pageNo = 1;
			}
			let count = await Post.countDocuments({$or: [{tags: req.params.tagName},{realm: req.params.tagName}]}) ;
			query.skip = size * (pageNo - 1);
			query.limit = size;
			query.sort = {created_at: 'desc'};
			const article = await Post
				.find({
					$or: [{tags: req.params.tagName},{realm: req.params.tagName}]
				}, {}, query).lean();
			const response = {
				'message': article,
				'pages': Math.ceil(count/size),
				'pageNo': pageNo

			};
			res.send(response);
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get article tag',
				details: err
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
	async associatedArticles(req, res) {
		console.log(req.query);
		try {
			const pageNo = req.query.pageNo;
			const currId = req.query.id;
			const size = 5;
			let options = {};
			let query = {};
			options.skip = size * (pageNo - 1);
			options.limit = size;
			options.sort = {created_at: 'desc'};
			
			if(req.query.latestUnrelated === 'true') {
				const excludeIds = req.query.excludeIds;
				query = {
					// _id: { $ne: currId }
					_id: {$nin: excludeIds},
					$and: [{_id: { $ne: currId }}]
				};
			}
			else {
				
				const tags = req.query.tags;
				const realm = req.query.realm;
				query = {
					$or: [{realm: realm}, {realm: tags}, {tags: [realm]}, {tags: {$in: tags}}],
					$and: [{_id: { $ne: currId }}]
				};
			}
			const article = await Post
				.find(query, {}, options).lean();
			const response = {
				'message': article,
				'pageNo': pageNo
			};
			res.send(response);
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get associated articles',
				details: err
			});
		}
	},
	/**
   * 
   * @param {*} req 
   * @param {*} res 
   */
	async previews (req, res) {
		try {
			console.log('hello');
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get article previews',
				details: err
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
	async show (req, res) {
		try {
			const article = await Post.findById(req.params.articleId).lean();
			res.send(article);
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get articles',
				details: err
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
			const article = await Post.findByIdAndUpdate(
				req.params.articleId,
				req.body,
				{new: true}
			);
			res.send({
				article: article,
				message: 'Article was updated!'
			});
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to update the article',
				details: err
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
				_id: req.params.articleId
			});
			res.send({
				deleteCount: deleteCount,
				id: req.params.articleId
			});
		}
		catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to delete the article',
				details: err
			});
		}
	}
};