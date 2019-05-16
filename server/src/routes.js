//routes are used for declaring routes to all the controllers

const AuthenticationController = require('./controllers/AuthenticationController');
const ArticlesController = require('./controllers/ArticlesController');
const AdminArticleController = require('./controllers/AdminArticleController');
const TagsController = require('./controllers/TagsController');

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
// const jwt = require('express-jwt');
// const config = require('./config/config');

// let auth = jwt({
// 	secret: config.authentication.jwtSecret,
// 	userProperty: 'payload'
// });

module.exports = (app) => {
	

	app.get('/articles',
		ArticlesController.index);
	app.get('/tags',
		TagsController.getTags);
	app.get('/tag/:tagName',
		ArticlesController.articlesByTag);
	app.get('/infinite-articles',
		ArticlesController.associatedArticles);
	app.get('/articles/:articleId',
		ArticlesController.articlesById),
	app.get('/articlesByContributor/:contributorId',
		ArticlesController.articlesByContributor);

	/* Admin User Routes */

	app.get('/api/articles', 
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.index	
	);

	app.post('/register',
		// AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.register);
	app.get('/users',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.getUsers);
	app.post('/login',  
		AuthenticationController.login);
	app.post('/addUser', 
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.addUser);

	app.post('/contributor/:contributorId', 
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.updateContributor);
	app.get('/contributor/:contributorId',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.getContributor);
	/* Refresh Token */
	app.post('/tokens',
		AuthenticationController.refreshToken);
	app.post('/tokens/removeRefresh', 
		AuthenticationController.rejectToken);
		
	/* Admin Tag Routes */
	app.post('/tags',
		AuthenticationControllerPolicy.authenticateToken,
		TagsController.addTags);
	app.put('/tags',
		AuthenticationControllerPolicy.authenticateToken,
		TagsController.update);
	app.delete('/tags',
		AuthenticationControllerPolicy.authenticateToken,
		TagsController.deleteTags);

	/* Admin Article Routes */
	app.post('/article',
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.postArticle);
	app.put('/articles/:articleId',
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.update);
	app.delete('/article/:articleId',
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.delete);
	app.get('/contributors',
		AdminArticleController.contributors);
};