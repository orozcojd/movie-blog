//routes are used for declaring routes to all the controllers

const AuthenticationController = require('./controllers/AuthenticationController');
const ArticlesController = require('./controllers/ArticlesController');
const AdminArticleController = require('./controllers/AdminArticleController');
const TagsController = require('./controllers/TagsController');
const AdminContributorController = require('./controllers/AdminContributorController');
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
// const jwt = require('express-jwt');
// const config = require('./config/config');

// let auth = jwt({
// 	secret: config.authentication.jwtSecret,
// 	userProperty: 'payload'
// });


require('connect-flash');
var ExpressBrute = require('express-brute'),
	MemcachedStore = require('express-brute-memcached'),
	// moment = require('moment'),
	store;
 
if (true){
	store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
} else {
	// stores state with memcached
	store = new MemcachedStore(['127.0.0.1'], {
		prefix: 'NoConflicts'
	});
}
 
let failCallback = function (req, res, next, nextValidRequestDate) {
	console.log('fail callbak');
	res.status(404).send({message: 'Too many login attempts. Please try again later.'});
	// req.flash('error', 'You\'ve made too many failed attempts in a short period of time, please try again ');
	// res.redirect('/articles'); // brute force protection triggered, send them back to the login page
};
let handleStoreError = (error) => {
	// log.error(error); // log this error so we can figure out what went wrong
	// cause node to exit, hopefully restarting the process fixes the problem
	throw {
		message: error.message,
		parent: error.parent
	};
};
// Start slowing requests after 5 failed attempts to do something for the same user
let userBruteforce = new ExpressBrute(store, {
	freeRetries: 5,
	minWait: 5*60*1000, // 5 minutes
	maxWait: 60*60*1000, // 1 hour,
	failCallback: failCallback,
	handleStoreError: handleStoreError
});
// No more than 1000 login attempts per day per IP
let globalBruteforce = new ExpressBrute(store, {
	freeRetries: 1000,
	attachResetToRequest: false,
	refreshTimeoutOnRequest: false,
	minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
	maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
	lifetime: 24*60*60, // 1 day (seconds not milliseconds)
	failCallback: failCallback,
	handleStoreError: handleStoreError
});

module.exports = (app) => {
	
	app.get('/', 
		ArticlesController.root);
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
		globalBruteforce.prevent,
		userBruteforce.getMiddleware({
			key: function(req, res, next) {
				// prevent too many attempts for the same username
				next(req.body.email);
			}
		}),
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
	app.get('/api/contributor/:contributorId',
		AuthenticationControllerPolicy.authenticateToken,
		AdminContributorController.getContributor);

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