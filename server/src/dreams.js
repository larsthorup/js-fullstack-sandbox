const env = require('./env.json')
const pgp = require('pg-promise')();
const db = pgp(env.DATABASE);

exports.handler = async (event) => {
  switch (event.httpMethod) {
    case 'GET':
      const rowList = await db.query('select * from dream order by title');
      return {
        statusCode: 200,
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(rowList)
      };
    default:
      return { statusCode: 405, body: '' }
  }
}
