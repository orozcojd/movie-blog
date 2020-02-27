const { Post, ReviewStatus, Tags } = require('../models');
const { login } = require('./Authorization/Helpers');
const { api } = require('./Services/api');


let tagNames = [];
function newTagNames () {
	tagNames = [];
	for (let i = 0; i < 3; i++)
		tagNames.push(Math.random().toString(36)
			.substring(7));
}
async function createTag (contributorId, name, realm = false) {
	const tag = await Tags.create({
		contributorId,
		name,
		realm,
		urlTag: name,
		img: null,
		lazyImg: null,
	});
	return tag._id;
}

const getPostSchema = async ({ status = ReviewStatus.eedsReview, contributorId, realm = null, tags = null, full }) => {
	newTagNames();
	let article = {
		title: 'article title',
		author: 'jonathan devon orozco',
		imgCred: 'description for image',
		img: 'https://i.lensdump.com/i/iJskp0.md.png',
		lazyImg: 'https://i.lensdump.com/i/iJskp0.md.png',
		realm: realm || await createTag(contributorId, tagNames[0], realm = true),
		contributorId,
		status,
		// tags,
	};
	if (full) article = {
		...article,
		body: '<p style="text-align: left">Article Body edited</p>',
		draft: false,
		status,
		tags: tags || [ await createTag(contributorId, tagNames[1]),
			await createTag(contributorId, tagNames[2]) ],
		thumbnailDescription: 'New York state Attorney General Letitia Jame Pharma Accounts To let the people keep on waiting on something that will no',
	};

	return article;
};

module.exports = {
	async createDefaultPost (contributorId, numPosts = 1) {
		// const posts = [];
		for (let i = 0; i < numPosts; i++)
			await Post.create(getPostSchema({ contributorId }));
	},
	async postArticle ({ email, password, posts = 1 }) {
		const creds = await login({ email,
			password });
		const token = creds.token;
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