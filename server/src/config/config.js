/* */
module.exports = {
	env: {

	},
	appname: process.env.OPENSHIFT_APP_NAME || 'threepointO',
	port: process.env.OPENSHIFT_NODEJS_PORT || 8081,
	serverIp: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
	apiDomain: process.env.OPENSHIFT_DOMAIN || 'http://localhost',
	db: {
		database: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/personalblog',
		// user: process.OPENSHIFT_MONGODB_DB_USER || 'jonorozco',
		// password: process.env.OPENSHIFT_MONGODB_DB_PASS || 'personalblog',
	},
	authentication: {
		jwtSecret: process.env.OPENSHIFT_JWT_SECRET || 'secret',
		tmpUser: process.env.tmpUserName || 'jonathan',
		tmpPsswrd: process.env.tmpPasswrd || 'password',
		superUser: process.env.OPENSHIFT_SUPER_USER || 1,
		AdminUser: process.env.OPENSHIFT_ADMIN_USER || 2,
		creator: process.env.OPENSHIFT_CREATOR_PERMISSION || 3,
		recaptchaSecret: process.env.OPENSHIFT_RECAPTCHA,
	},
	nodemailer: {
		admin: 'System Administrator',
	},
	ratelimits: {
		login: process.env.OPENSHIFT_LOGIN_RATELIMIT || 1000,
		default: process.env.OPENSHIFT_DEFAULT_RATELIMIT || 10000,
		api: process.env.OPENSHIFT_API_RATELIMIT || 1000,
		adduser: process.env.OPENSHIFT_ADDUSER_RATELIMIT || 1000,
	},
	googleOauth: {
		user: process.env.OPENSHIFT_NODEMAILER_USER,
		clientId: process.env.OPENSHIFT_NODEMAILER_CLIENT_ID,
		secret: process.env.OPENSHIFT_NODEMAILER_SECRET,
		uri: process.env.OPENSHIFT_NODEMAILER_URI,
		token: process.env.OPENSHIFT_OAUTH_TOKEN,
		refresh: process.env.OPENSHIFT_OAUTH_REFRESH,
		expires: process.env.OPENSHIFT_OAUTH_EXPIRES,
	},
};