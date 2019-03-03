const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
const config = require('../config/config')
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    hash: String,

});
UserSchema.methods.hashPassword = function(password) {
  /*
    hashes password using bcrypt and sets user hash
  */

  const SALT_FACTOR = 8
  bcrypt
  .genSaltAsync(SALT_FACTOR)
  .then(salt => {
    return bcrypt.hashAsync(password, salt, null)})
  .then(hash => {
    this.hash = hash
  })
}

UserSchema.methods.comparePasswords = async (password) => {
  /*
    returns boolean of bcrypt compare method
  */
  console.log(this)
  return await bcrypt.compare(password, this.pass)
}

UserSchema.methods.generateToken = function() {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  
  return jwt.sign({
    _id: this._id,
    email: this.email,
    exp: parseInt(expiry.getTime() / 1000)
  },config.authentication.jwtSecret)
}


module.exports = mongoose.model('User', UserSchema);
