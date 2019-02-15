const Joi = require('joi');

module.exports = {
    register (req, res, next) {
        const schema = {
            email: Joi.string().email(),
            password: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9]{8,32}$')
            )
        }
        const {error, value} = Joi.validate(req.body, schema)
        if(error) { 
            let err = ''
            switch(error.details[0].context.key) {
                case 'email':
                    err = 'You must send a valid email address.'
                    res.status(400).send({
                        error: err
                    })
                    break;
                case 'password': 
                    err = `Password failed to match the following rules:
                        <br>
                        1. It must be between 8-32 characters on length.
                        <br>
                        2. No special characters are allowed.
                        <br>
                        3. Must consist of only lower case, upper case, or numeric characters.`
                    res.status(400).send({
                            error: err
                        })
                default: 
                    err = 'Invalid registration information.'
                    res.status(400).send({
                        error: err
                    })
            }
        } 
        else {
            next();
        }
    }
}