const axios = require('axios');

const api = headers => axios.create({
	baseURL: 'http://localhost:8082/',
	timeout: 1000,
	headers: { ...headers },
});

module.exports = {
	api,
};