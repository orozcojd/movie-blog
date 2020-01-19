'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	ROOT_API: '"http://localhost:8081"',
	CAPTCHA_SITE_KEY: '"6Lewn9AUAAAAAFJ5AKZjBRer56-jo5LJjEWtKRjD"'
})
