/* eslint-disable no-undef */
const axios = require('axios');
const { Post } = require('../../models');


const api = headers => axios.create({
	baseURL: 'http://localhost:8082/',
	timeout: 1000,
	headers: { ...headers },
});
const getPostSchema = ({ contributorId, full }) => {
	let article = {
		title: 'article title',
		author: 'jonathan devon orozco',
		imgCred: 'description for image',
		img: 'https://i.lensdump.com/i/iJskp0.md.png',
		lazyImg: 'https://i.lensdump.com/i/iJskp0.md.png',
		realm: 'sample-realm',
		contributorId,
	};
	if (full) article = {
		...article,
		body: '<p style="text-align: left">Article Body edited</p>',
		draft: false,
		tags: [
			'delete-me!',
			'futuristic',
		],
		thumbnailDescription: 'New York state Attorney General Letitia Jame Pharma Accounts To let the people keep on waiting on something that will no',
	};
	return article;
};

module.exports = {
	async login ({ email, password }) {
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
	},
	async createDefaultPost (contributorId, numPosts = 1) {
    for(i = 0; i < numPosts; i++) {
      await Post.create(getPostSchema({ contributorId }));
    }
		
	},
	getPostSchema,
};
