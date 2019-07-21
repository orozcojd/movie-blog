/* */
module.exports = {
	port: process.env.PORT || 8081,
	db: {
		database: process.env.DB_NAME || 'mongodb+srv://jonorozco:<fodbor-gixraJ-popbo9>@cluster0-g74ql.gcp.mongodb.net/test?retryWrites=true&w=majority',
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