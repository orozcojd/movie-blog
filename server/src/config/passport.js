var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
const {User} = require('../models')

passport.use(new LocalStrategy({
  usernameField: 'email'
},
  (username, password, done) => {
    User.findOne({email: username}, (err, user) => {
      if(err) { console.log(err); return done(err) }
      // return if user not found
      if(!user) {
        return done(null, false, {
          message: 'Username not found'
        })
      }
      user.comparePasswords(password)
      .then(res => {
        if(!match) {
          return done(null, false, {
            message: 'Password incorrect'
          })
        }
        //return user object - valid creds
        return done(null, user)
      })
      .catch(err => {
        return done(null, false, {
          message: 'Internal Server Error'
        })
      })
    })
  }
))