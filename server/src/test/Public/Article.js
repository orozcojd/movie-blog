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
let createdRealms = [];
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

// 'cinematic', 'opinionated'
describe('Posts', () => {
	before(async () => { // Before each test we empty the database
		const res = await login({ // login and get new jwt token
			email: 'socaljorozco@gmail.com',
			password: 'password',
		});
		USER = res.user;
	});
	afterEach(() => {
		console.log('CLEANING UP..');
		createdTags = [];
		createdRealms = [];

	});
	describe('/GET post', () => {
		let expected = [];
		const numPosts = 50;
		beforeEach(async () => {
			expected = [];
			Post.remove({}, err => {
				if (err) return err;
			});
			Tags.remove({}, err => {
				if (err) return err;
			});
			Review.remove({}, err => {
				if (err) return err;
			});
			/* create tags */
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
			for (let i = 0; i < numPosts; i++) {
				// create 50 posts 10 of each different status type
				const payload = await getPostSchema({ status: status[i % 5],
					contributorId: USER.contributorId });
				const post = await Post.create(payload);
				expected.push(post);
			}
		});
		it('it should only GET the posts that are approved', async () => {
			chai.request(server)
				.get('/articles')
				.end((err, res) => {
					const exptedLength = numPosts / status.length;
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
		});
		it('it should only GET the posts with status equal to AP', async () => {
			chai.request(server)
				.get('/articles')
				.end(async (err, res) => {
					const exptedLength = numPosts / status.length;
					res.body.should.be.a('Array');
					for (let i = 0; i < exptedLength; i++) {
						res.body[i].should.have.property('_id');
						const id = res.body[i]._id;
						const post = await Post.findById(id);
						assert.equal(post.status, ReviewStatus.approved, 'post has status proved');
					}
				});
		});
	});
	describe('/GET post by ID', async () => {
		it('it should return the post given an ID', async () => {
			const payload = await getPostSchema({ status: ReviewStatus.approved,
				contributorId: USER.contributorId,
				full: true });
			const post = await Post.create(payload);
			chai.request(server)
				.get(`/articles/${ post._id }`)
				.end(async (err, res) => {
					res.body.should.be.a('Object');
					res.body.should.not.have.property('status').eql(post.status);
					res.body.should.have.property('title').eql(post.title);
					res.body.should.have.property('img').eql(post.img);
					res.body.should.have.property('author').eql(post.author);
					res.body.should.have.property('thumbnailDescription').eql(post.thumbnailDescription);
					res.body.should.have.property('tags').to.have.length(post.tags.length);
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
		});
		it('it should not return posts that are not published, given an ID', async () => {
			const notApproved = [ ReviewStatus.editing, ReviewStatus.inReview,
				ReviewStatus.needsReview, ReviewStatus.draft ];
			for (let i = 0; i < notApproved.length; i++) {
				const payload = await getPostSchema({ status: notApproved[i % 4],
					contributorId: USER.contributorId });
				const post = await Post.create(payload);
				chai.request(server)
					.get(`/articles/${ post._id }`)
					.end((err, res) => {
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
					});
			}
		});
		it('it should return an error when an invalid ID is passed', async () => {
			const payload = await getPostSchema({ status: ReviewStatus.approved,
				contributorId: USER.contributorId });
			await Post.create(payload);
			chai.request(server)
				.get(`/articles/${ null }`)
				.end((err, res) => {
					res.body.should.be.a('Object');
					res.body.should.have.property('error').eql('An error has occured trying to get articles');
					res.status.should.equal(400);
				});
		});
	});
	describe('/GET post by TAG name', () => {
		beforeEach(async () => {
			// create posts
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
		// 	chai.request(server)
		// 		.get('/articles/tags/artistic')
		// 		.end((err, res) => {
		// 			res.body.should.be.a('Array');
		// 			res.body.should.have.length(50);
		// 		});
		// });
	});
});