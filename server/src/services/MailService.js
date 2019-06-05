const nodemailer = require('nodemailer');
const config = require('../config/config');


module.exports = {
	async sendResetPwEmail(user, contributor) {
		let transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				// later put into env var
				user: config.nodemailer.username,
				pass: config.nodemailer.pw
			}
		});
		const resetLink = `http://localhost:8080/?#/admin/password-reset?token=${user.resetToken}`;
		await transporter.sendMail({
			from: '"Fred Foo 👻" <' + config.nodemailer.username + '>', // sender address
			to: user.email, // list of receivers
			subject: 'unsolicitedcolumns - Password Reset', // Subject line
			// text: `Hello ${contributor.name}, you are receiving this email because you have
			// initiated a request for a password reset. Follow the link below to continue with the process.`, // plain text body
			html: '<h1> Password Reset </h1> <div> Hello ' + contributor.name + ', you are receiving this email because '
      + ' you have initiated a request for a password reset. Follow the link below to continue with the process. </div>' 
      + '<div> <a target="_blank" href=" ' + resetLink + '">' + resetLink + '</a> </div>'
		},(err, success) => {
			// console.log(err);
			// console.log(success);
		});
	}
};