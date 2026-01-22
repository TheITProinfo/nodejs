
// app.js
// A simple Express web server
// To run this server, ensure you have Node.js and Express installed.
// You can install Express by running: npm install express
// Then start the server with: node app.js
// import the express module
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!welcome to my web server.');
});

app.listen(port, () => {
  console.log(`the web server is now listening at http://localhost:${port}`);
});