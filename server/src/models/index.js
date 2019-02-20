/*
    initializes all models and sources them as .model-name
*/
fs = require('fs')
fs
    .readdirSync(__dirname)
    .filter((file) => 
        file !== 'index.js'
    )
    .forEach((file) => {
        const moduleName = file.split('.')[0];
        exports[moduleName] = require('./' + moduleName);
    })
