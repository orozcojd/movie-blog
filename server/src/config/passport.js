let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
// var mongoose = require('mongoose');
const {User} = require('../models');

passport.use(new LocalStrategy({
	usernameField: 'email'
},
(username, password, done) => {
	User.findOne({email: username}, (err, user) => {
		if(err) { console.log(err); return done(err); }
		// return if user not found
		if(!user) {
			return done(null, false, {
				message: 'Invalid Login Credentials'
			});
		}
		user.comparePasswords(password)
			.then(res => {
				if(!res) {
					return done(null, false, {
						message: 'Invalid Login Credentials'
					});
				}
				//return user object - valid creds
				return done(null, user);
			})
			.catch(err => {
				console.log(err);
				return done(null, false, {
					message: 'Internal Server Error'
				});
			});
	});
}
));