//routes are used for declaring routes to all the controllers

const AuthenticationController = require('./controllers/AuthenticationController');
const ArticlesController = require('./controllers/ArticlesController');
const TagsController = require('./controllers/TagsController');

// const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
// const jwt = require('express-jwt');
// const config = require('./config/config');

// let auth = jwt({
// 	secret: config.authentication.jwtSecret,
// 	userProperty: 'payload'
// });

module.exports = (app) => {
	
	//delete
	app.get('/users',
		AuthenticationController.getUsers);
	/* login */
	app.post('/register',
		// AuthenticationControllerPolicy.register,
		AuthenticationController.register);
	app.post('/login',  
		AuthenticationController.login);
	app.post('/addUser', 
		AuthenticationController.addUser);
	/* articles */
	app.post('/article',
		// auth,
		ArticlesController.postArticle);
	app.get('/articles',
		// auth,
		ArticlesController.index);
	app.get('/tags',
		TagsController.getTags);
	app.post('/tags',
		TagsController.addTags);
	app.put('/tags',
		TagsController.update);
	app.delete('/tags',
		TagsController.deleteTags);
	app.get('/tag/:tagName',
		ArticlesController.getArticlesByTag);
	app.get('/infinite-articles',
		ArticlesController.associatedArticles);
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