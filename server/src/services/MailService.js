const nodemailer = require('nodemailer');
const config = require('../config/config');
const { google } = require('googleapis');

function getOauthClient (user) {
	// Generate a url that asks permissions for Gmail scopes
	// const GMAIL_SCOPES = [
	// 	'https://mail.google.com/',
	// 	'https://www.googleapis.com/auth/gmail.modify',
	// 	'https://www.googleapis.com/auth/gmail.compose',
	// 	'https://www.googleapis.com/auth/gmail.send',
	// ];
	// const url = oauthClient.generateAuthUrl({
	// 	access_type: 'offline',
	// 	scope: GMAIL_SCOPES,
	// });
	// const oauthClient = new google.auth.OAuth2(
	// 	config.googleOauth.clientId,
	// 	config.googleOauth.secret,
	// 	config.googleOauth.uri
	// );
	// const code = '4/qwE_a5OqMjN9se5kAyEm9JCrm6fdpQMugsp5rgtKvREMovpC3blgstobCXAI2KGB7VOc-4nfMatjyQ8uC5gA7gc';
	// const getToken = async () => {
	// 	const { tokens } = await oauthClient.getToken(code);
	// };
	// getToken();
	config.nodemailer.username = config.googleOauth.user;
	const params = {
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			user: config.googleOauth.user,
			clientId: config.googleOauth.clientId,
			clientSecret: config.googleOauth.secret,
			refreshToken: config.googleOauth.refresh,
			accessToken: config.googleOauth.token,
			expires: config.googleOauth.expires,
		},
	};
	user.name = config.googleOauth.user;
	return params;
}
async function getLocalClient (user) {
	const testAccount = await nodemailer.createTestAccount();
	const params = {
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
		sendmail: true,
	};
	user.name = testAccount.user;
	return params;
}
module.exports = {
	async sendResetPwEmail (user, contributor) {
		const islocal = Boolean(process.env.NODE_ENV !== 'production');
		const emailuser = {
			name: '',
		};
		const params = islocal ? await getLocalClient(emailuser) : await getOauthClient(emailuser);
		const transporter = nodemailer.createTransport(params);
		const resetLink = `${ config.apiDomain }:8080/?#/auth/password-reset?token=${ user.resetToken }`;
		await transporter.sendMail({
			from: `"${ config.nodemailer.admin }" <${ emailuser.name }>`,
			to: user.email, // list of receivers
			subject: `${ config.appname } - Password Reset`, // Subject line
			html: '<h1> Password Reset </h1> <div> Hello ' + contributor.name + ', you are receiving this email because '
      + ' you have initiated a request for a password reset. Follow the link below to continue with the process. </div>'
      + '<div> <a target="_blank" href=" ' + resetLink + '">' + resetLink + '</a> </div>',
		}, (err, success) => {
			console.log(success);
		});
	},
};