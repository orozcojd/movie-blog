const {Post} = require('../models');

// Post.find().remove().exec();
// Tags.collection.dropAllIndexes(function (err, results) {
// });
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
			let options = {};
			if(req.query.skip)
				options.skip = parseInt(req.query.skip);
			if(req.query.limit)
				options.limit = parseInt(req.query.limit);
			options.sort = {created_at: 'desc'};
			let query = {};
			query.draft = false;
			const articles = await Post.find(query,{}, options).lean();
			
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
	async articlesByTag (req, res) {
		try {
			const size = 12;
			console.log(req.query);
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
			const articles = await Post
				.find({
					$or: [{tags: req.params.tagName},{realm: req.params.tagName}]
				}, {}, query).lean();
			const response = {
				'message': articles,
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
	async articlesByContributor(req, res) {
		try {
			const size = 12;
			let pageNo = parseInt(req.query.page);
			console.log(req.query);
			// console.log(req.params);
			let query = {};
			if(pageNo <= 0 || isNaN(pageNo)) {
				// set pageNo to 1 if invalid
				pageNo = 1;
			}
			let count = await Post.countDocuments({contributorId: req.params.contributorId});
			query.skip = size * (pageNo - 1);
			query.limit = size;
			query.sort = {created_at: 'desc'};

			const articles = await Post.find({
				contributorId: req.params.contributorId
			}, {}, query).lean();

			const response = {
				'message': articles,
				'pages': Math.ceil(count/size),
				'pageNo': pageNo

			};

			res.send(response);

		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get associated articles',
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
	// /**
	//  * 
	//  * @param {*} req 
	//  * @param {*} res 
	//  */
	// async previews (req, res) {
	// 	try {
	// 		console.log('hello');
	// 	}
	// 	catch (err) {
	// 		res.status(400).send({
	// 			error: 'An error has occured trying to get article previews',
	// 			details: err
	// 		});
	// 	}
	// },
	/**
   * GET REQUEST BY ID
   * Finds the article by id and sends the reponse if id is valid
   * otherwise sends 400 error 
   * @param {Object} req 
   * @param {Object} res 
   */
	async articlesById (req, res) {
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
	}
};