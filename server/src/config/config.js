/* */
module.exports = {
	port: process.env.OPENSHIFT_NODEJS_PORT || 8081,
	serverIp: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	db: {
		database: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/personalblog',
		user: process.OPENSHIFT_MONGODB_DB_USER || 'jonorozco',
		password: process.env.OPENSHIFT_MONGODB_DB_PASS || 'personalblog',
	},
	authentication: {
		jwtSecret: process.env.OPENSHIFT_JWT_SECRET || 'secret',
		tmpUser: process.env.tmpUserName || 'jonathan',
		tmpPsswrd: process.env.tmpPasswrd || 'password',
		superUser: process.env.OPENSHIFT_SUPER_USER || 1,
		AdminUser: process.env.OPENSHIFT_ADMIN_USER || 2
	},
	nodemailer: {
		username: process.env.OPENSHIFT_MAILER_EMAIL || 'test@gmail.com',
		pw: process.env.OPENSHIFT_MAILER_PW || null
	}
};