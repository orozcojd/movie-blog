//routes are used for declaring routes to all the controllers

const AuthenticationController = require('./controllers/AuthenticationController');
const ContributorController = require('./controllers/ContributorController');
const ArticlesController = require('./controllers/ArticlesController');
const TagsController = require('./controllers/TagsController');
const PermissionController = require('./controllers/PermissionController');
const AdminArticleController = require('./controllers/AdminArticleController');
const AdminContributorController = require('./controllers/AdminContributorController');
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
const PermissionControllerPolicy = require('./policies/PermissionControllerPolicy');
const VerifyJsonPolicy = require('./policies/VerifyJsonPolicy');

// const jwt = require('express-jwt');
// const config = require('./config/config');\

const slowDown = require('express-slow-down');


const authSpeedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, // 15 minutes
	delayAfter: 5, // allow 5 requests to go at full-speed, then...
	delayMs: 500, // 6th request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
	skipSuccessfulRequests: true
});

const apiSpeedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, 
	delayAfter: 50, 
	delayMs: 100
});

const appSpeedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, 
	delayAfter: 500, 
	delayMs: 1000
});

module.exports = (app) => {
	app.get('/', 
		appSpeedLimiter,
		ArticlesController.root);
	app.post('/login',
		VerifyJsonPolicy.verifyJson,
		AuthenticationControllerPolicy.recaptchaPolicy,
		authSpeedLimiter,
		AuthenticationController.login);
	app.get('/articles',
		appSpeedLimiter,
		ArticlesController.index);
	app.get('/articles/:articleId',
		appSpeedLimiter,
		ArticlesController.articlesById),
	app.get('/tags',
		appSpeedLimiter,
		TagsController.getTags);
	app.get('/tag/:tagName',
		appSpeedLimiter,
		ArticlesController.articlesByTag);
	app.get('/infinite-articles',
		appSpeedLimiter,
		ArticlesController.associatedArticles);
	app.get('/articlesByContributor/:contributorId',
		appSpeedLimiter,
		ArticlesController.articlesByContributor);
	app.get('/contributors/:contributorId',
		appSpeedLimiter,
		ContributorController.getContributor);
	app.get('/contributors',
		appSpeedLimiter,
		ContributorController.contributors);


	/* Admin User Routes */
	app.get('/api/user-permission',
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.getFullUser,
	);
	app.get('/api/users',
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationController.getUsers);
	app.post('/api/users',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		PermissionControllerPolicy.checkCreatorPermissions,
		AuthenticationControllerPolicy.recaptchaPolicy,
		PermissionControllerPolicy.validatePermissions,
		AuthenticationController.addUser);
	app.put('/api/users',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		PermissionControllerPolicy.validatePermissions,
		AuthenticationController.updateUserPermission);
	app.delete('/api/users/:userId',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		PermissionControllerPolicy.validatePermissions,
		AuthenticationController.deleteUser);
	app.post('/api/auth/forgot-password',
		apiSpeedLimiter,
		VerifyJsonPolicy.verifyJson,
		AuthenticationControllerPolicy.recaptchaPolicy,
		AuthenticationController.forgotPassword);
	app.post('/api/auth/reset-password',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationControllerPolicy.validatePassword,
		AuthenticationController.resetPassword);
	// app.get('/api/contribuor-name',
	// 	apiSpeedLimiter,
	// 	AuthenticationControllerPolicy.authenticateToken,
	// 	AuthenticationController.getContributorName);
	app.get('/api/contributors/:contributorId',
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AdminContributorController.getContributor);
	app.put('/api/contributors/:contributorId',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationControllerPolicy.contributorAccessControl,
		AdminContributorController.updateContributor);
	
	/** permissions */
	app.get('/api/permissions',
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		PermissionController.getPermissions
	);
	app.post('/api/permissions',
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		PermissionController.addPermissions
	);
	app.put('/api/permissions',
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		PermissionController.updatePermissions
	);

	/* Refresh Token */
	app.post('/tokens',
		apiSpeedLimiter,
		VerifyJsonPolicy.verifyJson,
		AuthenticationController.refreshToken);
	app.post('/tokens/removeRefresh', 
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationController.rejectToken);

	/* Admin Tag Routes */
	app.post('/api/tags',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		TagsController.addTags);
	app.put('/api/tags',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		TagsController.update);
	app.delete('/api/tags',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		PermissionControllerPolicy.validatePermissions,
		PermissionControllerPolicy.checkCreatorPermissions,
		TagsController.deleteTags);

	/* Admin Article Routes */
	app.get('/api/articles', 
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.index	
	);
	app.get('/api/articles/:articleId', 
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.fetchArticle );
	app.post('/api/articles',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AdminArticleController.postArticle);
	app.put('/api/articles/:articleId',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationControllerPolicy.contributorAccessControl,
		AdminArticleController.update);
	app.delete('/api/articles/:articleId',
		VerifyJsonPolicy.verifyJson,
		apiSpeedLimiter,
		AuthenticationControllerPolicy.authenticateToken,
		AuthenticationControllerPolicy.contributorAccessControl,
		AdminArticleController.delete);
};