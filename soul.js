// start soul server on Soul Server in a Docker container
const express = require('express');

const app = express();

app.listen(8080, async () => {
  console.log('Soul server started on port 8080');
});

app.get('/', async (req, res) => {
  res.send('DONE');
});
