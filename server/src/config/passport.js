var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
const {User} = require('../models')

passport.use(new LocalStrategy({
  usernameField: 'email'
},
  (username, password, done) => {
    console.log('aaaaaa')
    User.findOne({email: username}, (err, user) => {
      console.log('--------')
      if(err) { console.log(err); return done(err) }
      // return if user not found
      if(!user) {
        return done(null, false, {
          message: 'Username not found'
        })
      }
      // console.log(user)
      // return if incorrect password
      if(!user.comparePasswords(password)) {
        return done(null, false, {
          message: 'Password incorrect'
        })
      }
      // return user object - valid creds
      console.log('valid user')
      return done(null, user)
    })
  }
))