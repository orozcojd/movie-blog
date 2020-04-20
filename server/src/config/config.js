/* */
const env = process.env.NODE_ENV;
const development = production = {
	appname: process.env.OPENSHIFT_APP_NAME || 'threepointO',
	port: process.env.OPENSHIFT_NODEJS_PORT || 8081,
	serverIp: process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
	apiDomain: process.env.OPENSHIFT_DOMAIN || 'http://localhost',
	db: {
		database: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://mongodatabase/personalblog',
	},
	authentication: {
		jwtSecret: process.env.OPENSHIFT_JWT_SECRET || 'secret',
		tmpUser: process.env.tmpUserName || 'jonathan',
		tmpPsswrd: process.env.tmpPasswrd || 'password',
		superUser: process.env.OPENSHIFT_SUPER_USER || 1,
		AdminUser: process.env.OPENSHIFT_ADMIN_USER || 2,
		creator: process.env.OPENSHIFT_CREATOR_PERMISSION || 3,
		recaptchaSecret: process.env.OPENSHIFT_RECAPTCHA || '"6Lewn9AUAAAAADiHZxVd9iy0WNX8U5tmoZf7j3h-"', // localhost key
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
const test = {
	appname: 'threepointO',
	port: 8082,
	serverIp: '0.0.0.0',
	apiDomain: 'http://localhost',
	db: {
		database: 'mongodb://localhost:27017/test',
	},
	authentication: {
		jwtSecret: 'secret',
		tmpUser: 'jonathan',
		tmpPsswrd: 'password',
		superUser: 1,
		AdminUser: 2,
		creator: 3,
		recaptchaSecret: '"6Lewn9AUAAAAADiHZxVd9iy0WNX8U5tmoZf7j3h-"', // localhost key
	},
	nodemailer: {
		admin: 'System Administrator',
	},
	ratelimits: {
		login: 1000,
		default: 10000,
		api: 1000,
		adduser: 1000,
	},
};
const config = {
	development,
	test,
	production,
};
module.exports = config[env];