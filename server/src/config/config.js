/* */
module.exports = {
	port: process.env.PORT || 8081,
	db: {
		database: process.env.DB_NAME || 'mongodb://localhost:27017/personalblog',
		user: process.DB_USER || 'personalblog',
		password: process.env.DB_PASS || 'personalblog',
	},
	authentication: {
		jwtSecret: process.env.JWT_SECRET || 'secret',
		tmpUser: process.env.tmpUserName || 'jonathan',
		tmpPsswrd: process.env.tmpPasswrd || 'password',
		superUser: process.env.superUser || 1,
		AdminUser: process.env.adminUser || 2
	}
};