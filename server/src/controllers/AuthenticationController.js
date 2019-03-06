// controllers are used for declaring all the endpoints
let {User} = require('../models')
const config = require('../config/config')
const passport = require('passport');


module.exports = {
    async register (req, res) {
        try {
            console.log("INSIDE REGISTER")
            let user = new User();

            // set user email
            user.email = req.body.email;

            // hash password and set pw
            await user.hashPassword(req.body.password)
            userJson = user.toJSON()
            console.log(userJson)
            user.save((err) => {
                if(err) {
                    res.status(400).send({
                        error: 'Email already in use'
                    })
                }
                else {
                    let token;
                    token = user.generateToken()
                    res.status(200).send({
                        "token": token
                    })
                }
            })
        } catch (err) {
            res.status(400).send({
                error: 'Unexpected error has occurred'
            })
        }
    },

    login (req, res) {
        console.log('inside login')
        passport.authenticate('local', (err, user, info) => {
            console.log('PASSPORT CALL')
            let token;
            if (err) {
                console.log('ERROR IN LOGIN')
                res.status(404).json(err);
                return;
                }
            if (user) {
                console.log(user)
                token = user.generateToken();
                res.status(200).send({
                    "token": token,
                    "user": user.email
                })
            } else {
                console.log('ANOTHER ERROR')
                res.status(401).json(info)
            }
        })(req, res);
    }
}