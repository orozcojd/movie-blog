/* eslint-disable no-undef */

const { Post } = require('../../models');
const { login } = require('../Authorization/Helpers');
const { api } = require('../Helpers');

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
	async createDefaultPost (contributorId, numPosts = 1) {
		const posts = [];
		for (i = 0; i < numPosts; i++)
			await Post.create(getPostSchema({ contributorId }));
	},
	async postArticle ({ email, password, posts = 1 }) {
		const creds = await login({ email,
			password });
		token = creds.token;
		const postArr = [];
		for (let i = 0; i < posts; i++) {
			const post = await api({ Authorization: token })
				.post('/api/articles', getPostSchema({ contributorId: creds.user.contributorId }));
			postArr.push(post.data.article);
		}
		return postArr;
	},
	async updatePost ({ _id, status = ReviewStatus.needsReview }) {
		return await Post.findByIdAndUpdate(_id, { status }, { new: true });
	},
	getPostSchema,
};
