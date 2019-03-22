//routes are used for declaring routes to all the controllers

const AuthenticationController = require('./controllers/AuthenticationController');
const ArticlesController = require('./controllers/ArticlesController');
const TagsController = require('./controllers/TagsController');
const RealmsController = require('./controllers/RealmsController');


// const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
// const jwt = require('express-jwt');
// const config = require('./config/config');

// let auth = jwt({
// 	secret: config.authentication.jwtSecret,
// 	userProperty: 'payload'
// });

module.exports = (app) => {
    
	/* login */
	app.post('/register',
		// AuthenticationControllerPolicy.register,
		AuthenticationController.register);
	app.post('/login',  
		AuthenticationController.login);

	/* articles */
	app.post('/article',
		// auth,
		ArticlesController.postArticle);
	app.get('/articles',
		// auth,
		ArticlesController.index);
	app.get('/realms', 
		RealmsController.getRealms);
	app.post('/realms', 
		RealmsController.addRealms);
	app.get('/tags',
		TagsController.getTags);
	app.post('/tags', 
		TagsController.addTags);
	app.get('/tag/:tagName',
		ArticlesController.getArticlesByTag);
	app.get('/article-preview', 
		ArticlesController.previews);
	app.get('/articles/:articleId',
		ArticlesController.show),
	app.put('/articles/:articleId',
		// auth,
		ArticlesController.update);
	app.delete('/article/:articleId',
		// auth,
		ArticlesController.delete);
};