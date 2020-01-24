/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const { Post, ReviewStatus, Review } = require('../../models');
const { createDefaultPost, getPostSchema, postArticle, updatePost } = require('./Helpers');
const { login } = require('../Authorization/Helpers');
const { getReviewSchema } = require('../Review/Helpers');

chai.use(chaiHttp);
let API_TOKEN = null;
let USER = null;
let CONTRIBUTOR = null;

describe('Posts', () => {
	beforeEach(async () => { // Before each test we empty the database
		Post.remove({}, err => {
			if (err) return err;
		});
		Review.remove({}, err => {
			if (err) return err;
		});
		try {
			const res = await login({ // login and get new jwt token
				email: 'socaljorozco@gmail.com',
				password: 'password',
			});
			API_TOKEN = res.token;
			USER = res.user;
			CONTRIBUTOR = res.contributor;
		} catch (err) {
			return err;
		}
	});

	describe('/GET post', () => {
		it('it should GET all the posts', done => {
			chai.request(server)
				.get('/articles')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
		it('it should return one post after creating a post', async () => {
			await createDefaultPost(USER.contributorId);
			const res = await chai.request(server)
				.get('/api/articles')
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.length.should.be.eql(1);
		});

		it('it should GET queried post', async () => {
			const post1 = getPostSchema({ contributorId: USER.contributorId }); // create two posts
			const post2 = getPostSchema({ contributorId: USER.contributorId });

			post2.realm = 'another-realm'; // change realm on a post
			const posts = [ post1, post2 ];
			for (const post of posts)
				await Post.create(post);
			const res = await chai.request(server)
				.get(`/api/articles?realm=${ post2.realm }`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.length.should.be.eql(1); // expect only one post based on query
			res.body[0].realm.should.equal(post2.realm);
		});
		it('it should GET a post given the id', async () => {
			const payload = getPostSchema({ contributorId: USER.contributorId });
			const post = await Post.create(payload);
			const res = await chai.request(server)
				.get(`/articles/${ post._id }`);
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('title');
			res.body.should.have.property('body');
			res.body.should.have.property('tags');
			res.body.should.have.property('thumbnailDescription');
			res.body.should.have.property('status');
			res.body.should.have.property('__type');
			res.body.should.have.property('author');
			res.body.should.have.property('imgCred');
			res.body.should.have.property('img');
			res.body.should.have.property('lazyImg');
			res.body.should.have.property('realm');
			res.body.should.have.property('contributorId');
			res.body.should.have.property('created_at');

		});
	});

	describe('/POST post', () => {
		it('it should POST a post without a contributorId', done => {
			const article = getPostSchema({ contributorId: null });
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.article.should.have.property('title');
					res.body.article.should.have.property('author');
					res.body.article.should.have.property('imgCred');
					res.body.article.should.have.property('img');
					res.body.article.should.have.property('lazyImg');
					res.body.article.should.have.property('realm');
					res.body.article.author.should.equal(CONTRIBUTOR);
					done();
				});
		});

		it('it should not post without a title', done => {
			const { title, ...article } = getPostSchema({ contributorId: null }); // remove title from object
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					done();
				});
		});
		it('it should populate author name from JWT user signature ', done => {
			const { author, ...article } = getPostSchema({ contributorId: null }); // remove author from object
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.article.author.should.equal(CONTRIBUTOR);
					done();
				});
		});
		it('it should POST not post without the imgCred', done => {
			const { imgCred, ...article } = getPostSchema({ contributorId: null });
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					done();
				});
		});
		it('it should POST not post without the img', done => {
			const { img, ...article } = getPostSchema({ contributorId: null });
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					done();
				});
		});
		it('it should POST not post without the lazyImg', done => {
			const { lazyImg, ...article } = getPostSchema({ contributorId: null });
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					done();
				});
		});
		it('it should POST not post without the realm', done => {
			const { realm, ...article } = getPostSchema({ contributorId: null });
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('error');
					done();
				});
		});
		it('__type and status properties should be default', done => {
			const article = getPostSchema({ contributorId: null });
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.article.should.have.property('status').eql('NR');
					res.body.article.should.have.property('__type').eql('Post');
					done();
				});
		});
		it('it should POST an article', done => {
			const article = getPostSchema({ contributorId: null,
				full: true });
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.article.should.have.property('body');
					res.body.article.should.have.property('draft');
					res.body.article.should.have.property('thumbnailDescription');
					expect(res.body.article.tags).to.have.length(2);
					done();
				});
		});
		it('it should not accept invalid image ext', done => {
			const article = {
				title: 'article title',
				imgCred: 'description for image',
				img: 'https://i.lensdump.com/i/iJskp0.md.txt',
				lazyImg: 'https://i.lensdump.com/i/iJskp0.md.png',
				realm: 'sample-realm',
			};
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
				});
		});
		it('it should not use the supplied contributorId', done => {
			const article = {
				title: 'article title',
				imgCred: 'description for image',
				img: 'https://i.lensdump.com/i/iJskp0.md.txt',
				lazyImg: 'https://i.lensdump.com/i/iJskp0.md.png',
				realm: 'sample-realm',
				contributorId: '123456789',
			};
			chai.request(server)
				.post('/api/articles')
				.set('Authorization', API_TOKEN)
				.send(article)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.article.contributorId.should.equal(USER.contributorId); // from JSON web tkn
					done();
				});
		});
	});
	describe('/PUT post', () => {
		it('it should update and return a post', async () => {
			const article = getPostSchema({ contributorId: USER.contributorId });
			const post = await Post.create(article);
			// verify post matches payload
			const res = await chai.request(server)
				.get(`/api/articles/${ post._id }`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('title').eql(article.title);
			const newTitle = 'Updated my article title!';
			post.title = newTitle;
			const updated = await chai.request(server)
				.put(`/api/articles/${ post._id }`)
				.send(post)
				.set('Authorization', API_TOKEN)
				.set('Content-type', 'application/json');
			updated.should.have.status(200);
			updated.body.should.be.a('object');
			updated.body.article.should.have.property('title').eql(newTitle);
		});
		it('it should not allow you to update a post you didnt create', async () => {
			const article = getPostSchema({ contributorId: USER.contributorId });
			// create a article with user1
			const post = await Post.create(article);

			// login to user2
			const res = await login({ // login and get new jwt token
				email: 'camille.tsalik@gmail.com',
				password: 'password',
			});
			API_TOKEN = res.token;

			// try to update article with user2
			const updated = await chai.request(server)
				.put(`/api/articles/${ post._id }`)
				.send(post)
				.set('Authorization', API_TOKEN)
				.set('Content-type', 'application/json');
			updated.should.have.status(404);
			updated.body.should.be.a('object');
			updated.body.should.have.property('error').eql('Oops! The article you are trying to update does not exist.');
		});
	});
	describe('/DELETE post', () => {
		it('it should delete a post given an id', async () => {
			const article = getPostSchema({ contributorId: USER.contributorId });
			const post = await Post.create(article);
			const res = await chai.request(server)
				.delete(`/api/articles/${ post._id }`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.deleteCount.should.have.property('n').eql(1);
			res.body.should.have.property('id').eql(post._id.toString());
		});
		it('it should not allow you to delete a post that isnt yours', async () => {
			const article = getPostSchema({ contributorId: USER.contributorId });
			const post = await Post.create(article);
			const token = await login({ // login and get new jwt token
				email: 'camille.tsalik@gmail.com',
				password: 'password',
			});
			API_TOKEN = token.token;

			const res = await chai.request(server)
				.delete(`/api/articles/${ post._id }`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(404);
			res.body.should.be.a('object');
			res.body.should.have.property('error').eql('Oops! The article you are trying to delete does not exist.');
		});
	});
});

describe('GET /api/articles/review', () => {
	const numPosts = 10; // number of posts to be created before each test
	const reviewStatus = [ ReviewStatus.needsReview, ReviewStatus.approved, ReviewStatus.editing,
		ReviewStatus.inReview, ReviewStatus.draft ];
	const expectedLen = numPosts / reviewStatus.length;
	beforeEach(async () => { // Before each test we empty the database
		Post.remove({}, err => {
			if (err) return err;
		});
		Review.remove({}, err => {
			if (err) return err;
		});
		try {
			const defaultCreds = { // login and get new jwt token
				email: 'socaljorozco@gmail.com',
				password: 'password',
			};
			const res = await login(defaultCreds);
			API_TOKEN = res.token;
			USER = res.user;
			CONTRIBUTOR = res.contribu;

			const posts = await postArticle({ // create 10 posts with user1
				email: 'socaljorozco@gmail.com',
				password: 'password',
				posts: numPosts,
			});
			for (let i = 0; i < posts.length; i++) // update status of reviews
				await updatePost({
					_id: posts[i]._id,
					status: reviewStatus[i % reviewStatus.length], // apply different status for every post
				});
		} catch (err) {
			return err;
		}
	});
	describe('GET /api/articles/review', () => {
		it('it should return a select number of contributors articles when \
		status is NR and Review is false', async () => {
			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.needsReview }&review=false&rewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(expectedLen);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.needsReview }&review=false&revier=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(expectedLen);
		});
		it('it should not return any articles when Review=true \
		and no other contributor created articles', async () => {
			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.needsReview }&review=true&reviewer=false`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);
			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.needsReview }&review=true&revier=true`)
				.set('Authorization', API_TOKEN);
			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(0);
		});
		it('it should not return any articles when requester hasnt posted  \
		any articles and status is NR and Review is false', async () => {
			const token = await login({ // login and get new jwt token
				email: 'camille.tsalik@gmail.com',
				password: 'password',
			});
			API_TOKEN = token.token;

			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.needsReview }&review=false&reviewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.needsReview }&review=false&reviewer=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(0);
		});

		/* status editing */
		it('it should return requested articles when status is editing\
		and jwt matches article contributor', async () => {

			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.editing }&review=false&reviewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(expectedLen);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.editing }&review=true&reviewer=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(expectedLen);
		});
		it('it should not return any articles when requester hasnt posted  \
		any articles and status is editing', async () => {

			const token = await login({ // login and get new jwt token
				email: 'camille.tsalik@gmail.com',
				password: 'password',
			});
			API_TOKEN = token.token;
			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.editing }&review=false&reviewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.editing }&review=true&reviewer=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(0);
		});

		/* status in review */
		it('it should return requested articles when status is in review\
		and jwt matches article contributor', async () => {

			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.inReview }&review=false&reviewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(expectedLen);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.inReview }&review=true&reviewer=false`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(expectedLen);
		});
		it('it should not return requested articles when status is in review\
		and jwt matches article contributor and reviewer is true', async () => {

			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.inReview }&review=false&reviewer=true`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.inReview }&review=true&reviewer=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(0);
		});

		it('it should return requested articles when status is in review\
		and jwt matches reviewer contributorId and reviewer is true', async () => {

			const p = await Post.find({ status: ReviewStatus.inReview });

			const token = await login({ // login and get new jwt token
				email: 'camille.tsalik@gmail.com',
				password: 'password',
			});
			API_TOKEN = token.token;


			p.map(async a => { // set currReview to be contributorId of user2
				await Review.findOneAndUpdate({ postId: a._id }, { currReviewer: token.user.contributorId });
			});

			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.inReview }&review=false&reviewer=true`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(expectedLen); // should be len of posts / len of status array

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.inReview }&review=true&reviewer=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(expectedLen);
		});



		/* status is approved */
		it('it should return a select number of contributors articles when \
		status is approved and Review is false', async () => {
			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.approved }&review=false&rewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(expectedLen);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.approved }&review=false&revier=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(expectedLen);
		});
		it('it should not return any articles when Review=true \
		and no other contributor created articles', async () => {
			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.approved }&review=true&reviewer=false`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);
			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.approved }&review=true&revier=true`)
				.set('Authorization', API_TOKEN);
			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(0);
		});
		it('it should not return any articles when requester hasnt posted  \
		any articles and status is approved and Review is false', async () => {
			const token = await login({ // login and get new jwt token
				email: 'camille.tsalik@gmail.com',
				password: 'password',
			});
			API_TOKEN = token.token;

			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.approved }&review=false&reviewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.approved }&review=false&reviewer=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(0);
		});

		/* status is draft */
		it('it should return a select number of contributors articles when \
		status is approved and Review is false', async () => {
			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.draft }&review=false&rewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(expectedLen);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.draft }&review=false&revier=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(expectedLen);
		});
		it('it should not return any articles when Review=true \
		and no other contributor created articles', async () => {
			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.draft }&review=true&reviewer=false`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);
			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.draft }&review=true&revier=true`)
				.set('Authorization', API_TOKEN);
			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(0);
		});
		it('it should not return any articles when requester hasnt posted  \
		any articles and status is draft and Review is false', async () => {
			const token = await login({ // login and get new jwt token
				email: 'camille.tsalik@gmail.com',
				password: 'password',
			});
			API_TOKEN = token.token;

			const res = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.draft }&review=false&reviewer=false`)
				.set('Authorization', API_TOKEN);

			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);

			// following query should have no effect
			const response = await chai.request(server)
				.get(`/api/articles/review?status=${ ReviewStatus.draft }&review=false&reviewer=true`)
				.set('Authorization', API_TOKEN);

			response.should.have.status(200);
			response.body.should.be.a('array');
			response.body.should.have.length(0);
		});

		it('it should not return any articles when status is not provided in query', async () => {
			const res = await chai.request(server)
				.get('/api/articles/review')
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.should.have.length(0);
		});
	});
});

/* GET posts by revID */
describe('GET Post and Review by Review ID', () => {
	const numPosts = 10; // number of posts to be created before each test
	const reviewStatus = [ ReviewStatus.needsReview, ReviewStatus.approved, ReviewStatus.editing,
		ReviewStatus.inReview, ReviewStatus.draft ];
	beforeEach(async () => { // Before each test we empty the database
		Post.remove({}, err => {
			if (err) return err;
		});
		Review.remove({}, err => {
			if (err) return err;
		});
		try {
			const defaultCreds = { // login and get new jwt token
				email: 'socaljorozco@gmail.com',
				password: 'password',
			};
			const res = await login(defaultCreds);
			API_TOKEN = res.token;
			USER = res.user;
			CONTRIBUTOR = res.contribu;

			const posts = await postArticle({ // create 10 posts with user1
				email: 'socaljorozco@gmail.com',
				password: 'password',
				posts: numPosts,
			});
			for (let i = 0; i < posts.length; i++) // update status of reviews
				await updatePost({
					_id: posts[i]._id,
					status: reviewStatus[i % reviewStatus.length], // apply different status for every post
				});
		} catch (err) {
			return err;
		}
	});
	describe('GET /api/articles/review by ID', () => {
		it('it should not return any articles when Review=true \
			and no other contributor created articles', async () => {

			const post = new Post(getPostSchema({ contributorId: USER.contributorId,
				full: true }));
			const pSaved = await Post.create(post);
			const review = new Review(getReviewSchema({ postId: pSaved._id,
				contributorId: USER.contributorId }));
			const rSaved = await Review.create(review);
			const res = await chai.request(server)
				.get(`/api/articles/review/${ rSaved._id }`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('author').eql(pSaved.author);
			res.body.should.have.property('body').eql(pSaved.body);
			res.body.should.have.property('draft').eql(pSaved.draft);
			res.body.should.have.property('tags').eql(pSaved.tags);
			res.body.should.have.property('status').eql(pSaved.status);
			res.body.should.have.property('title').eql(pSaved.title);
			res.body.should.have.property('_id').eql(pSaved._id.toString());
			res.body.should.have.property('realm').eql(pSaved.realm);
			res.body.should.have.property('review').should.be.a('object');
			res.body.review.should.have.property('_id')
				.eql(rSaved._id.toString());
			res.body.review.should.have.property('contributorId')
				.eql(USER.contributorId);
			res.body.review.should.have.property('postId')
				.eql(pSaved._id.toString());
		});
		it('it should not return any articles when Review=true \
		and no other contributor created articles', async () => {

			const post = new Post(getPostSchema({ contributorId: USER.contributorId,
				full: true }));
			const pSaved = await Post.create(post);
			const review = new Review(getReviewSchema({ postId: pSaved._id,
				contributorId: USER.contributorId }));
			const rSaved = await Review.create(review);
			const res = await chai.request(server)
				.get(`/api/articles/review/${ rSaved._id }`)
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('author').eql(pSaved.author);
		});
	});
});