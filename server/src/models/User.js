const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

function hashPassword (user, options) {
    console.log('inside hash password');
    const SALT_FACTOR = 8

    if (!user.changed('password')) {
        return;
    }
    return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
        user.setDataValue('password', hash)
    })
}

module.exports = (sequelize, dataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: dataTypes.STRING,
            unique: true
        },
        password: dataTypes.STRING
    }, {
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword,
            // beforeSave: hashPassword
        }
    })
    User.prototype.comparePassword = function (password) {
        console.log(this.password)
        return bcrypt.compareAsync(password, this.password)
    }
    return User
}
