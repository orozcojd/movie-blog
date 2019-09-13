const ArticlesController = require('../controllers/ArticlesController');
const TagsController = require('../controllers/TagsController');
const AuthenticationController = require('../controllers/AuthenticationController');
const AuthenticationControllerPolicy = require('../policies/AuthenticationControllerPolicy');

const VerifyJsonPolicy = require('../policies/VerifyJsonPolicy');
const slowDown = require('express-slow-down');

const authSpeedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, // 15 minutes
	delayAfter: 5, // allow 5 requests to go at full-speed, then...
	delayMs: 500, // 6th request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
	skipSuccessfulRequests: true
});

const appSpeedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, 
	delayAfter: 500, 
	delayMs: 1000
});
const express = require('express'), router = express.Router();

router.get('/', 
	appSpeedLimiter,
	ArticlesController.root);
router.post('/login',
	VerifyJsonPolicy.verifyJson,
	AuthenticationControllerPolicy.recaptchaPolicy,
	authSpeedLimiter,
	AuthenticationController.login);
router.get('/articles',
	appSpeedLimiter,
	ArticlesController.index);
router.get('/articles/:articleId',
	appSpeedLimiter,
	ArticlesController.articlesById),
router.get('/tags',
	appSpeedLimiter,
	TagsController.getTags);
router.get('/tag/:tagName',
	appSpeedLimiter,
	ArticlesController.articlesByTag);
router.get('/infinite-articles',
	appSpeedLimiter,
	ArticlesController.associatedArticles);
router.get('/articlesByContributor/:contributorId',
	appSpeedLimiter,
	ArticlesController.articlesByContributor);
router.get('/contributors/:contributorId',
	appSpeedLimiter,
	AuthenticationController.getContributor);
