const nodemailer = require('nodemailer');


module.exports = {
	async sendResetPwEmail(user) {
		let transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				// later put into env var
				user: 'unsolicitedcolumns@gmail.com',
				pass: 'hyfdom-6fakCa-guxwuf'
			}
		});
		const resetLink = `http://localhost:8080/?#/admin/password-reset?token=${user.resetToken}`;
		await transporter.sendMail({
			from: '"Fred Foo 👻" <unsolicitedcolumns@gmail.com>', // sender address
			to: user.email, // list of receivers
			subject: 'unsolicitedcolumns - Password Reset', // Subject line
			// text: `Hello ${contributor.name}, you are receiving this email because you have
			// initiated a request for a password reset. Follow the link below to continue with the process.`, // plain text body
			html: '<h1> Password Reset </h1> <b> <a target="_blank" href=" ' + resetLink + '">' + resetLink + '</a>' // html body
		},(err, success) => {
			// console.log(err);
			// console.log(success);
		});
	}
};