/* */
module.exports = {
	port: process.env.OPENSHIFT_NODEJS_PORT || 8081,
	serverIp: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	db: {
		database: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/personalblog',
		user: process.DB_USER || 'jonorozco',
		password: process.env.DB_PASS || 'personalblog',
	},
	authentication: {
		jwtSecret: process.env.JWT_SECRET || 'secret',
		tmpUser: process.env.tmpUserName || 'jonathan',
		tmpPsswrd: process.env.tmpPasswrd || 'password',
		superUser: process.env.superUser || 1,
		AdminUser: process.env.adminUser || 2
	},
	nodemailer: {
		username: process.env.mailerUsername || 'unsolicitedcolumns@gmail.com',
		pw: process.env.mailerPw || 'hyfdom-6fakCa-guxwuf'
	}
};