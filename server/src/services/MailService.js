const nodemailer = require('nodemailer');
const config = require('../config/config');


module.exports = {
	async sendResetPwEmail(user, contributor) {
		const islocal = config.nodemailer.host !== 'gmail';
		const testAccount = await nodemailer.createTestAccount();
		let transporter = nodemailer.createTransport({
			service: islocal === true ? null : config.nodemailer.host,
			secure: islocal === true ? false : null,
			host: islocal === true ? config.nodemailer.host : null,
			port: islocal === true ? 587 : null,
			auth: {
				user: islocal === true ? config.nodemailer.username : testAccount.user,
				pass: islocal === true ? config.nodemailer.pw : testAccount.pass
			}
		});
		const resetLink = `${config.apiDomain}:8080/?#/admin/password-reset?token=${user.resetToken}`;
		await transporter.sendMail({
			from: '"' + config.nodemailer.admin + '"' + ' <' + config.nodemailer.username + '>', // sender address
			to: user.email, // list of receivers
			subject: 'unsolicitedcolumns - Password Reset', // Subject line
			html: '<h1> Password Reset </h1> <div> Hello ' + contributor.name + ', you are receiving this email because '
      + ' you have initiated a request for a password reset. Follow the link below to continue with the process. </div>' 
      + '<div> <a target="_blank" href=" ' + resetLink + '">' + resetLink + '</a> </div>'
		},(err, success) => {
		});
	}
};