// start soul server on Soul Server in a Docker container
const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Test = require('./soul-src/models/test');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect to MongoDB
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('Connected to MongoDB server');
});

// connect to localhost if not in Docker container
const mongoURL = process.env.ENVIRONMENT === 'docker'
  ? 'mongodb://mongo:27017/soul'
  : 'mongodb://localhost:27017/soul';
mongoose.connect(mongoURL);

app.listen(8080, () => {
  console.log('Soul server started on port 8080');
});

app.get('/', (req, res) => {
  res.send('DONE');
});

// TEST API
app.post('/api/test', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const testInst = new Test();
  testInst.author = req.body.author;
  testInst.content = req.body.content;

  testInst.save((error) => {
    if (error) {
      console.log(error);
      res.json({ result: 0 });
    }

    res.json({ result: 1 });
  });
});

// 트렐로 API
app.get('/trello/board/:id', () => {
  // retrieve board with id API
});

app.get('/trello/card/:id', () => {
  // retrieve card with id API
});
