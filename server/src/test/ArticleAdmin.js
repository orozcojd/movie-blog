const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = require('chai').should();
const { User, Contributor, Review, Post } = require('../models');

chai.use(chaiHttp);

describe('/api/articles', () => {
	beforeEach(done => { // Before each test we empty the database
		Post.remove({}, err => {
		});
		Review.remove({}, err => {
			done();
		});
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
