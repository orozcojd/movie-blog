/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const { Post, ReviewStatus, Review, Tags } = require('../../models');
const { createDefaultPost, getPostSchema, postArticle, updatePost } = require('../Helpers');
const { login } = require('../Authorization/Helpers');
const { getReviewSchema } = require('../Review/Helpers');

chai.use(chaiHttp);
const API_TOKEN = null;
let USER = null;
const CONTRIBUTOR = null;
let createdTags = [];
const status = [ ReviewStatus.approved, ReviewStatus.editing, ReviewStatus.inReview,
	ReviewStatus.needsReview, ReviewStatus.draft ];
const tags = [ { name: 'artistic',
	realm: false }, { name: 'technology',
	realm: false }, { name: 'cultural',
	realm: false },
{ name: 'furistic',
	realm: false }, { name: 'monetary',
	realm: false }, { name: 'musical',
	realm: false }, { name: 'cinematic',
	realm: false }, { name: 'opinionated',
	realm: false } ];

async function createTags (contributorId, createdTags) {
	for (let i = 0; i < tags.length; i++) {
		const tag = await Tags.create({
			img: null,
			lazyImg: null,
			realm: tags[i].realm,
			name: tags[i].name,
			urlTag: tags[i].name.split(' ').join('-'),
			contributorId: USER.contributorId,
		});
		createdTags.push(tag);
	}
}

// 'cinematic', 'opinionated'
describe('Posts', () => {
	before(async () => { // Before each test we empty the database
		const res = await login({ // login and get new jwt token
			email: 'socaljorozco@gmail.com',
			password: 'password',
		});
		USER = res.user;
	});

	describe('/GET post', () => {
		let expected = [];
		const numPosts = 50;
		const exptedLength = numPosts / status.length;
		beforeEach(async () => {
			expected = [];
			createdTags = [];
			await Post.remove().exec();
			await Tags.remove().exec();
			await Review.remove().exec();
			await createTags(USER.contributorId, createdTags);
			/* create tags */
			// for (let i = 0; i < tags.length; i++) {
			// 	const tag = await Tags.create({
			// 		img: null,
			// 		lazyImg: null,
			// 		realm: tags[i].realm,
			// 		name: tags[i].name,
			// 		urlTag: tags[i].name.split(' ').join('-'),
			// 		contributorId: USER.contributorId,
			// 	});
			// createdTags.push(tag);
			// }
			for (let i = 0; i < numPosts; i++) {
				// create 50 posts 10 of each different status type
				const payload = await getPostSchema({ status: status[i % 5],
					contributorId: USER.contributorId,
					tags: createdTags });
				const post = await Post.create(payload);
				expected.push(post);
			}
		});
		it('it should only GET the posts that are approved', async () => {
			const res = await chai.request(server)
				.get('/articles');
			res.body.should.be.a('Array');
			res.body.should.have.length(exptedLength);
			for (let i = 0; i < exptedLength; i++) {
				res.body[i].should.have.property('title');
				res.body[i].should.have.property('img');
				res.body[i].should.have.property('author');
				res.body[i].should.have.property('thumbnailDescription');
				res.body[i].should.have.property('_id');
				res.body[i].should.have.property('updatedAt');
				res.body[i].should.not.have.property('body');
				res.body[i].should.not.have.property('tags');
				res.body[i].should.not.have.property('status').eql(ReviewStatus.approved);
				res.body[i].should.not.have.property('__type');
				res.body[i].should.not.have.property('imgCred');
				res.body[i].should.not.have.property('lazyImg');
				res.body[i].should.not.have.property('realm');
				res.body[i].should.not.have.property('contributorId');
				res.body[i].should.not.have.property('created_at');
			}

		});
		it('it should only GET the posts with status equal to AP', async () => {
			const res = await chai.request(server)
				.get('/articles');
			res.body.should.be.a('Array');
			for (let i = 0; i < exptedLength; i++) {
				res.body[i].should.have.property('_id');
				const id = res.body[i]._id;

				const p = await Post.findById(id);

				assert.equal(p.status, ReviewStatus.approved, 'post has status approved');
			}
		});
	});


	/**
	 * TEST CASES FOR GET /ARTICLES/TAGS/:ID
	 */
	describe('/GET post by ID', async () => {
		let createdTags = [];
		beforeEach(async () => {
			expected = [];
			createdTags = [];
			await Post.remove().exec();
			await Tags.remove().exec();
			await Review.remove().exec();
			await createTags(USER.contributorId, createdTags);
		});
		it('it should return the post given an ID', async () => {
			const payload = await getPostSchema({ status: ReviewStatus.approved,
				contributorId: USER.contributorId,
				full: true,
				tags: createdTags.map(t => t._id) });
			const post = await Post.create(payload);
			const res = await chai.request(server)
				.get(`/articles/${ post._id }`);
			res.body.should.be.a('Object');
			res.body.should.not.have.property('status').eql(post.status);
			res.body.should.have.property('title').eql(post.title);
			res.body.should.have.property('img').eql(post.img);
			res.body.should.have.property('author').eql(post.author);
			res.body.should.have.property('thumbnailDescription').eql(post.thumbnailDescription);
			res.body.should.have.property('tags');
			res.body.should.have.property('body').eql(post.body);
			res.body.should.have.property('__type').eql(post.__type);
			res.body.should.have.property('imgCred').eql(post.imgCred);
			res.body.should.have.property('lazyImg').eql(post.lazyImg);
			res.body.should.have.property('realm');
			res.body.realm.should.have.property('_id').eql(String(post.realm));
			res.body.should.have.property('contributorId').eql(post.contributorId);
			res.body.should.have.property('created_at');
			res.body.should.have.property('updatedAt');
		});
		it('it should return the post containing tag objects, given an ID', async () => {
			const payload = await getPostSchema({ status: ReviewStatus.approved,
				contributorId: USER.contributorId,
				full: true,
				tags: createdTags.map(t => t._id) });
			const post = await Post.create(payload);

			// get all tags in db
			const allTags = await Tags.find({}, '-contributorId').lean();

			// map expected tags to tag objects
			const expectedTags = post.tags.map(id => {
				const found = allTags.find(tag => tag._id.toString() === String(id));

				return { ...found, // destructure object and replace _id field w/ str
					_id: found._id.toString() };
			});
			const res = await chai.request(server)
				.get(`/articles/${ post._id }`);
			res.body.should.have.property('tags').to.have.length(post.tags.length);
			res.body.should.have.property('tags').to.deep.equal(expectedTags);
		});

		it('it should not return posts that are not published, given an ID', async () => {
			const notApproved = [ ReviewStatus.editing, ReviewStatus.inReview,
				ReviewStatus.needsReview, ReviewStatus.draft ];
			for (let i = 0; i < notApproved.length; i++) {
				const payload = await getPostSchema({ status: notApproved[i % 4],
					contributorId: USER.contributorId,
					tags: createdTags });
				const post = await Post.create(payload);
				const res = await chai.request(server)
					.get(`/articles/${ post._id }`);
				res.body.should.be.a('Object');
				res.body.should.have.property('error').eql('Article was not found.');
				res.status.should.equal(404);
				res.body.should.not.have.property('title');
				res.body.should.not.have.property('img');
				res.body.should.not.have.property('author');
				res.body.should.not.have.property('thumbnailDescription');
				res.body.should.not.have.property('tags');
				res.body.should.not.have.property('body');
				res.body.should.not.have.property('__type');
				res.body.should.not.have.property('imgCred');
				res.body.should.not.have.property('lazyImg');
				res.body.should.not.have.property('realm');
				res.body.should.not.have.property('contributorId');
				res.body.should.not.have.property('created_at');
				res.body.should.not.have.property('updatedAt');
			}
		});
		it('it should return an error when an invalid ID is passed', async () => {
			const payload = await getPostSchema({ status: ReviewStatus.approved,
				contributorId: USER.contributorId,
				tags: createdTags });
			await Post.create(payload);
			const res = await chai.request(server)
				.get(`/articles/${ null }`);
			res.body.should.be.a('Object');
			res.body.should.have.property('error').eql('An error has occured trying to get articles');
			res.status.should.equal(400);
		});
	});

	/**
	 * TEST CASES FOR GET /ARTICLES/TAGS/:TAGNAME
	 */
	describe('/GET post by TAG name', () => {
		beforeEach(async () => {
			expected = [];
			await Post.remove().exec();
			await Tags.remove().exec();
			await Review.remove().exec();
			// const totalPosts = 100;
			// for (let i = 0; i < totalPosts; i++) {
			// 	const schema = getPostSchema({ status: notApproved[i % 4],
			// 		contributorId: USER.contributorId,
			// 		full: true,
			// 		tags: i % 2 === 0 ? tags : tags2,
			// 		realm: realm[i % 2] });
			// 	await Post.create(schema);
			// }

		});
		// it('it should GET the posts by tag name', async () => {
		// 	const res = await chai.request(server)
		// 		.get('/articles/tags/artistic');
		// 	console.log(res.body);
		// 	res.body.should.be.a('Array');
		// 	res.body.should.have.length(50);

		// });
	});
});