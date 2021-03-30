const neutrino = require('neutrino');

process.env.NODE_ENV = 'test';
process.env.BACKEND = 'https://treeherder.mozilla.org';

module.exports = neutrino().jest();
