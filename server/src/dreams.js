const db = require('./utils/db');

exports.handler = async (event) => {
  switch (event.httpMethod) {
    case 'GET':
      const rowList = await db.query('select * from dream order by title');
      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(rowList),
      };
    default:
      return { statusCode: 405, body: '' };
  }
};
