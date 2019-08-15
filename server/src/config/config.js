/* */
module.exports = {
	env: {
		
	},
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
		AdminUser: process.env.OPENSHIFT_ADMIN_USER || 2
	},
	nodemailer: {
		username: process.env.OPENSHIFT_MAILER_EMAIL || 'helen.herman61@ethereal.email',
		pw: process.env.OPENSHIFT_MAILER_PW || 'jvP5gqXuxRMT8qzbCK',
		admin: process.env.OPENSHIFT_MAIL_ADMIN || 'administrator',
		host: process.env.OPENSHIFT_NODE_MAIL_SERVICE || 'smtp.ethereal.email'
	}
};