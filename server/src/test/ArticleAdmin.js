const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = require('chai').should();
const { User, Contributor, Review, Post, Tags } = require('../models');

chai.use(chaiHttp);

describe('/api/articles', () => {
	beforeEach(async () => { // Before each test we empty the database
		await Post.remove().exec();
		await Tags.remove().exec();
		await Review.remove().exec();
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
	});
});
