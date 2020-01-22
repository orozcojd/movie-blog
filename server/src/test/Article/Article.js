/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const { Post } = require('../../models');
const { login, createDefaultPost, getPostSchema } = require('./Helpers.js');

chai.use(chaiHttp);
let API_TOKEN = null;
let USER = null;
let CONTRIBUTOR = null;

describe('Posts', () => {
	beforeEach(async () => { // Before each test we empty the database
		Post.remove({}, err => {
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

			// login to user2
			// const login = await chai.request(server)
			// 	.post('/login')
			// 	.send({
			// 		email: 'camille.tsalik@gmail.com',
			// 		password: 'password',
			// 	});
			// API_TOKEN = `Bearer ${ login.body.token }`;
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
	describe('GET /api/articles/review', () => {
		it('it should GET the requested articles for review', async () => {
			// const article = getPostSchema({ contributorId: USER.contributorId });
			// const post = await Post.create(article);
			const numPosts = 10;
			await createDefaultPost(USER.contributorId, numPosts); // create 10 posts
			const res = await chai.request(server)
				.get('/api/articles/review?status=NR')
				.set('Authorization', API_TOKEN);
			res.should.have.status(200);
			res.body.should.be.a('array').eql(numPosts);
		});
	});
});