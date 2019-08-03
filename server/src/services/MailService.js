const nodemailer = require('nodemailer');
const config = require('../config/config');


module.exports = {
	async sendResetPwEmail(user, contributor) {
		const islocal = config.nodemailer.host !== 'gmail';
		console.log(islocal);
		let transporter = nodemailer.createTransport({
			service: islocal === true ? null : config.nodemailer.host,
			host: islocal === true ? config.nodemailer.host : null,
			port: islocal === true ? 587 : null,
			auth: {
				user: config.nodemailer.username,
				pass: config.nodemailer.pw
			}
		});
		const resetLink = `${config.apiDomain}:8080/?#/admin/password-reset?token=${user.resetToken}`;
		console.log(resetLink);
		await transporter.sendMail({
			from: '"' + config.nodemailer.admin + '"' + ' <' + config.nodemailer.username + '>', // sender address
			to: user.email, // list of receivers
			subject: 'unsolicitedcolumns - Password Reset', // Subject line
			html: '<h1> Password Reset </h1> <div> Hello ' + contributor.name + ', you are receiving this email because '
      + ' you have initiated a request for a password reset. Follow the link below to continue with the process. </div>' 
      + '<div> <a target="_blank" href=" ' + resetLink + '">' + resetLink + '</a> </div>'
		},(err, success) => {
			console.log(err);
			console.log(success);
		});
	}
};