require('dotenv').config();
const express = require('express');
const pgp = require('pg-promise')();

const db = pgp(process.env.DATABASE);
const port = 3001; // Note: must match port of the "proxy" URL in app/package.json

const app = express();

app.use(express.static('app')); // Note: serve app as static assets
app.get("/", function (request, response) { // Note: redirect root URL to index.html in app
  response.sendFile(__dirname + '/app/index.html');
});

async function dreamsGetHandler (request, response) {
  const rowList = await db.query('select * from dream');
  response.send(rowList);
}
app.get("/api/dreams", dreamsGetHandler);

function listeningHandler () {
  console.log(`Server is listening on port ${port}`);
}
app.listen(port, listeningHandler);
