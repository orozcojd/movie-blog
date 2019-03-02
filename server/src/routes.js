//routes are used for declaring routes to all the controllers

const AuthenticationController = require('./controllers/AuthenticationController');
const ArticlesController = require('./controllers/ArticlesController');

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');

module.exports = (app) => {
    
    /* login */
    app.post('/register',
        AuthenticationControllerPolicy.register,
        AuthenticationController.register)
    app.post('/login',  
        AuthenticationController.login)

    /* articles */
    app.post('/article',
        ArticlesController.postArticle)
    app.get('/articles',
        ArticlesController.index)
    app.get('/article-preview', 
        ArticlesController.previews)
    app.get('/articles/:articleId',
        ArticlesController.show),
    app.put('/articles/:articleId',
        ArticlesController.update)
    app.delete('/article/:articleId',
        ArticlesController.delete)
}