const { api } = require('../Services/api');

const login = async ({ email, password }) => {
	const creds = {
		user: null,
		contributor: null,
		token: null,
	};
	const res = await api().post('/login', {
		email,
		password,
	});
	creds.token = `Bearer ${ res.data.token }`;
	creds.user = res.data.user;
	const token = await api({
		Authorization: creds.token,
	}).get('/api/contributors');
	creds.contributor = token.data.name;
	return creds;
};
module.exports = {
	login,
};