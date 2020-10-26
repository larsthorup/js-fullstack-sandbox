const env = require('../env.json');
const pgp = require('pg-promise')();
module.exports = pgp(env.DATABASE);
