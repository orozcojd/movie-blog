const {Post} = require('../models');
let {Contributor} = require('../models');
let {User} = require('../models');
const mongoose = require('mongoose');
const helpers = require('../helpers/Auth');


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
			const articles = await Post.find(req.query,{}, options).lean();
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
	 * If user requesting article for edit is contributor, then sends article
	 * otherwise sends 403 error.
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async fetchArticle(req, res) {
		if(!req.params.articleId) {
			return res.status(422).json({message: 'Invalid Article identifier.'});
		}
		const user = await User.findById(req.userId);
		const article = await Post.findById(req.params.articleId).lean();
		const isNotArticleContr = user.contributorId !== article.contributorId;
		if(isNotArticleContr) {
			res.status(403).send({
				error: 'You are unauthorized to make changes to this account!'
			});
			return; 
		}
		res.status(200).send(article);
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
			const article = await Post.create(req.body);
			res.send({
				article: article,
				message: 'Article was created!'
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
   * PUT REQUEST
   * Updates article by id and sends the returned response if valid --
   * otherwise sends 400 error 
   * @param {Object} req 
   * @param {Object} res 
   */
	async update (req, res) {
		try {
			const contributor = await Contributor.findOne({
				_id: req.body.contributorId
			}).lean();
			req.body.author = contributor.name;
			const article = await Post.findOneAndUpdate(
				{contributorId: req.body.contributorId, _id: req.params.articleId},
				req.body,
				{new: true}
			);
			if(article){
				res.send({
					article: article,
					message: 'Article was updated!'
				});
			}
			else {
				res.status(404).send({
					error: 'Oops! The article you are trying to update does not exist.',
					// details: err
				});
			}
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
	},
	/**
	 * Finds all contributors and returns the array in the response
	 * @param {Object} req 
	 * @param {Object} res 
	 */
	async contributors(req, res) {
		try {
			const contributors = await Contributor.find().lean();
			res.send(contributors);
		} catch (err) {
			res.status(400).send({
				error: 'An error has occured trying to get contributors',
				details: err
			});
		}

	}
};