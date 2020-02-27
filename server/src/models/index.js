/**
 * Initializes all models and sources them as .model-name
 */
const fs = require('fs');

fs
	.readdirSync(__dirname)
	.filter(file =>
		file !== 'index.js'
	)
	.forEach(file => {
		const moduleName = file.split('.')[0];
		if (moduleName === 'Tags')
			exports[moduleName] = require('./' + moduleName).Tags;

		else
			exports[moduleName] = require('./' + moduleName);
	});
