// start soul server on Soul Server in a Docker container
const express = require('express');
const axios = require('axios');

const app = express();

const bodyParser = require('body-parser');

// 아래 부분을 지우면 몽고DB 사용 없이 외부 API 연결 작업을 한다
const mongoose = require('mongoose');

const Test = require('./soul-src/models/test');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const _key = 'b99f16d67481b93e65e19d84f64806ab';
const _token = '1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53';


// connect to MongoDB
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('Connected to MongoDB server');
});

// connect to localhost if not in Docker container
const mongoURL = process.env.ENVIRONMENT === 'docker'
  ? 'mongodb://mongo:27017/soul' // ENVIRONMENT 환경변수가 도커면 도커 컨테이너로 연결
  : 'mongodb://localhost:27017/soul'; // 그렇지 않다면 개발 환경 (로컬로 연결)
mongoose.connect(mongoURL);

const server = app.listen(8080, () => {
  console.log('Soul server started on port 8080');
});

const stopServer = () => {
  server.close(); // 위에서 시작한 새로운 서버를 닫아준다
  // 테스트할 때 필요한 툴 (프로덕션 상에서는 상관없음)
};

app.get('/', (req, res) => {
  res.status(200);
  res.send({ status: 'DONE' });
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
app.get('/task-api/board', (req, res) => {
  // get avocado board lists
  const boardURL = `${trelloURL}/1/boards/${boardID}/lists/`;
  axios.get(boardURL)
    .then((response) => {
      const boardsData = response.data;
      res.status(200);
      // res.send(boardsData); // 데이터를 통으로 보내주거나
      // 아래처럼 json구조 안에 data라는 키값에 데이터를 보내줄 수도 있음
      res.json({ data: boardsData });
    })
    .catch((error) => {
      // 에러 발생시 status는 501로 하고 에러 메세지를 result로 보내준다
      res.status(501); // 제대로 태스크 처리 못함: 501에러
      res.json({ result: 'FAILED TO GET AVOCADO BOARD' });
    });
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

// API which is getting lists of board.
app.get('task-api/list', async (req, res) => {
  const listURL = `${trelloURL}/1/boards/${boardID}/`;
  const lists = await axios.get(listURL)
    .catch((error) => {
      res.status(501);
      res.json(error);
    });
  const listsData = lists.data;
  res.status(200);
  res.json({ data: listsData });
});

app.get('/task-api/list:id', async (req, res) => {
  // get any board lists with id
  const id = req.params.id; // URL에서 :id 부분 빼오기
  const listURL = `${trelloURL}/1/lists/${id}/`;
  const list = await axios.get(listURL)
    .catch((error) => {
      res.status(501);
      res.json({ result: `FAILED TO GET ${id} BOARD` });
      res.json(error);
    });
  const listData = list.data;
  res.status(200);
  res.json({ data: listData });
});


app.get('/task-api/card:Listid/', async (req, res) => {
  // get any board lists with id
  const Listid = req.params.Listid; // URL에서 :id 부분 빼오기
  const CardURL = `${trelloURL}/1/lists/${Listid}/cards`;
  const Card = await axios.get(CardURL)
    .catch((error) => {
      res.status(501);
      res.json({ result: `FAILED TO GET ${id} BOARD` });
      res.json(error);
    });
  const CardData = Card.data;
  res.status(200);
  res.json({ data: CardData });
});

app.get('/task-api/card:CardId/', async (req, res) => {
  // get any board lists with id
  const CardId = req.params.CardId; // URL에서 :id 부분 빼오기
  const CardURL = `${trelloURL}/1/cards/${CardId}`;
  const Card = await axios.get(CardURL)
    .catch((error) => {
      res.status(501);
      res.json({ result: `FAILED TO GET ${id} BOARD` });
      res.json(error);
    });
  const CardData = Card.data;
  res.status(200);
  res.json({ data: CardData });
});

app.post('/api/test/lists:name:IdBoard', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const Name = req.params.name;
  const IdBoard = req.params.IdBoard;
  const ListURL = `${trelloURL}/1/lists`;
  const options = {
    method: 'POST',
    url: ListURL,
    qs: {
      name: Name,
      idBoard: IdBoard,
      key: _key,
      token: _token,
    },
  };
  requests(options, (error, response, body) => {
    const testInst = new test();
    testInst.LogTime = Date.getTime();
    testInst.response = response;
    testInst.body = body;

    testInst.save((error) => {
      console.log(error);
      res.json({ result: 0 });
    });
    res.json({ result: 1 });
  });
});

module.exports = {
  app,
  stopServer,
};
