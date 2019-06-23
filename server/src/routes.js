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


	app.post('/register',
		// AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.register);
	app.get('/users',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.getUsers);
	app.post('/login',  
		AuthenticationController.login);
	app.post('/auth/forgot-password',
		AuthenticationController.forgotPassword);
	app.post('/auth/reset-password',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationControllerPolicy.validatePassword,
		AuthenticationController.resetPassword);
	app.post('/addUser',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.addUser);
	app.put('/contributor/:contributorId',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationControllerPolicy.contributorAccessControl,
		AuthenticationController.updateContributor);
	app.get('/api/contribuor-name',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.getContributorName);
	app.get('/contributor/:contributorId',
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
	app.get('/api/articles', 
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.index	
	);
	app.get('/api/article/:articleId', 
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.fetchArticle );
	app.post('/article',
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.postArticle);
	app.put('/articles/:articleId',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationControllerPolicy.contributorAccessControl,
		AdminArticleController.update);
	app.delete('/article/:articleId',
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationControllerPolicy.contributorAccessControl,
		AdminArticleController.delete);
	app.get('/contributors',
		AdminArticleController.contributors);
};