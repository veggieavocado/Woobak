// start soul server on Soul Server in a Docker container
const express = require('express');
const axios = require('axios');

const app = express();

const bodyParser = require('body-parser');

// 몽고DB 사용 없이 외부 API 연결 작업을 한다
// const mongoose = require('mongoose');
//
// const Test = require('./soul-src/models/test');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // connect to MongoDB
// const db = mongoose.connection;
// db.on('error', console.error);
// db.once('open', () => {
//   console.log('Connected to MongoDB server');
// });
//
// // connect to localhost if not in Docker container
// const mongoURL = process.env.ENVIRONMENT === 'docker'
//   ? 'mongodb://mongo:27017/soul'
//   : 'mongodb://localhost:27017/soul';
// mongoose.connect(mongoURL);

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
  testInst.author = req.body.author; // author와 content를 post data로 받음
  testInst.content = req.body.content;

  testInst.save((error) => {
    if (error) {
      console.log(error);
      res.json({ result: 0 });
    }

    res.json({ result: 1 });
  });
});


// 트렐로 API wrapper

const trelloURL = 'http://api.trello.com';
const boardID = 'akii79A7';

// peepee가 작성하는 예시 API 하나
app.get('/task-api/board', async (req, res) => {
  // get avocado board lists
  const boardURL = `${trelloURL}/1/boards/${boardID}/lists/`;
  const boards = await axios.get(boardURL)
    .catch((error) => {
      // 에러 발생시 status는 501로 하고 에러 메세지를 result로 보내준다
      res.status(501); // 제대로 태스크 처리 못함: 501에러
      res.json({ result: 'FAILED TO GET AVOCADO BOARD' });
    });
  const boardsData = boards.data;
  res.status(200);
  // res.send(boardsData); // 데이터를 통으로 보내주거나
  // 아래처럼 json구조 안에 data라는 키값에 데이터를 보내줄 수도 있음
  res.json({ data: boardsData });
});

app.get('/task-api/board/:id', async (req, res) => {
  // get any board lists with id
  const id = req.params.id; // URL에서 :id 부분 빼오기
  const boardURL = `${trelloURL}/1/boards/${id}/lists/`;
  const boards = await axios.get(boardURL)
    .catch((error) => {
      res.status(501);
      res.json({ result: `FAILED TO GET ${id} BOARD` });
    });
  const boardsData = boards.data;
  res.status(200);
  res.json({ data: boardsData });
});
