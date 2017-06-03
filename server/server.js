require('dotenv').config();
const express = require('express');
const pgp = require('pg-promise')();
// console.log('process.env.DATABASE', process.env.DATABASE);
const db = pgp(process.env.DATABASE);
const port = 3001; // Note: must match port of the "proxy" URL in app/package.json

const app = express();

// app.use(express.static('public'));
// app.get("/", function (request, response) {
//   response.sendFile(__dirname + '/views/index.html');
// });

async function onGetDreams (request, response) {
  const rowList = await db.query('select * from dream');
  const dreamList = rowList.map(row => row.title);
  response.send(dreamList);
}
app.get("/api/dreams", onGetDreams);

async function onDreamPosted (request, response) {
  const dream = request.query.dream;
  await db.query(`insert into dream (title) values ('${dream}')`);
  response.sendStatus(200);
}
app.post("/api/dreams", onDreamPosted);

async function onDeleteDream (request, response) {
  const dream = request.query.dream;
  await db.query(`delete from dream where title = '${dream}'`);
  response.sendStatus(200);
}
app.delete("/api/dreams", onDeleteDream);

function listener () {
  console.log(`Server is listening on port ${port}`);
}
app.listen(port, listener);
