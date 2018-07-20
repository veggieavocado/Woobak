// start soul server on Soul Server in a Dockercontainer
const express = require('express');

const axios = require('axios');


const app = express();

const bodyParser = require('body-parser');

const Raven = require('raven');

Raven.config('https://bc4f8ac717fc4b2aaf85df3ff7ef9873@sentry.io/1245153').install();
// 몽고DB 사용 없이 외부 API 연결 작업을 한다
// const mongoose = require('mongoose');
//
// const Test = require('./soul-src/models/test');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const _key = config._key;
const _token = config._token;
const mongooseAddress = config.mongooseAddress;
console.log(mongooseAddress);
// MongoDB
const mongoose = require('mongoose');

mongoose.connect(mongooseAddress);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', (callback) => {
  console.log('Connection succeeded.');
});
const Schema = mongoose.Schema;
const TestSchema = new Schema({
  date: {
    type: String,
    unique: true,
  },
  ModuleName: {
    type: String,
  },
  success: Boolean,
});
const IsSucces = mongoose.model('IsSuccess', TestSchema);


// // connect to localhost if not in Docker container
// const mongoURL = process.env.ENVIRONMENT === 'docker'
//   ? 'mongodb://mongo:27017/soul'
//   : 'mongodb://localhost:27017/soul';
// mongoose.connect(mongoURL);

app.listen(8080, () => {
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

function getDate() {
  const date = new Date();
  let hour = date.getHours();
  hour = (hour < 10 ? '0' : '') + hour;
  let min = date.getMinutes();
  min = (min < 10 ? '0' : '') + min;
  let sec = date.getSeconds();
  sec = (sec < 10 ? '0' : '') + sec;
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;
  let day = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  return `${year }:${month }:${ day}:${hour }:${ min }:${ sec}`;
}
app.post('/api/test', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  // --- PP
  // I updated that if this function succeeded to send data to mongo,
  // then save <now time> to DB.
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/api/test',
  });
  isSucces.save((error) => {
    if (error) {
      console.log(error);
      res.json({ result: 0 });
    }
    console.log('check the DB');
    res.json({ result: 1 });
  });
});

const trelloURL = config.trelloURL;
const boardID = config.boardID; // Sprint ID
app.get('/task-api/board', async (req, res) => {
  console.log(boardID, trelloURL);
  const boardURL = `${trelloURL}/1/boards/${boardID}/lists/`;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/board',
  });
  const boards = await axios.get(boardURL)
    .catch((error) => {
      isSucces.success = false;
      isSucces.save();
      res.status(501); // 제대로 태스크 처리 못함: 501에러
      res.json({ result: 'FAILED TO GET AVOCADO BOARD' });
    });
  const boardsData = boards.data;
  res.status(200);
  res.json({ data: boardsData });
  isSucces.save();
});

app.get('/task-api/board/:id', async (req, res) => {
  // get any board lists with id
  console.log('okay he is here!');
  console.log(req.params.id);
  const id = req.params.id; // URL에서 :id 부분 빼오기
  const boardURL = `${trelloURL}/1/boards/${id}/lists/`;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/board/:id',
  });
  const boards = await axios.get(boardURL)
    .catch((error) => {
      res.status(501);
      res.json({ result: `FAILED TO GET ${id} BOARD` });
      isSucces.success = false;
      isSucces.save();
    });
  const boardsData = boards.data;
  res.status(200);
  res.json({ data: boardsData });
  isSucces.save();
});

// API which is getting lists of board.
app.get('/task-api/list', async (req, res) => {
  const listURL = `${trelloURL}/1/boards/${boardID}/`;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list',
  });
  const lists = await axios.get(listURL)
    .catch((error) => {
      isSucces.success = false;
      isSucces.save();
      res.status(501);
      res.json(error);
    });
  isSucces.save();
  const listsData = lists.data;
  res.status(200);
  res.json({ data: listsData });
});

app.get('/task-api/list:id', async (req, res) => {
  // get any board lists with id
  const id = req.params.id; // URL에서 :id 부분 빼오기
  const listURL = `${trelloURL}/1/lists/${id}/`;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list:id',
  });
  const list = await axios.get(listURL)
    .catch((error) => {
      isSucces.success = false;
      isSucces.save();
      res.status(501);
      res.json({ result: `FAILED TO GET ${id} BOARD` });
      res.json(error);
    });
  isSucces.save();
  const listData = list.data;
  res.status(200);
  res.json({ data: listData });
});


app.get('/task-api/card:Listid/', async (req, res) => {
  // get any board lists with id
  const Listid = req.params.Listid; // URL에서 :id 부분 빼오기
  const CardURL = `${trelloURL}/1/lists/${Listid}/cards`;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/card:Listid/',
  });
  const Card = await axios.get(CardURL)
    .catch((error) => {
      res.status(501);
      res.json({ result: `FAILED TO GET ${id} BOARD` });
      res.json(error);
      isSucces.success = false;
      isSucces.save();
    });
  const CardData = Card.data;
  res.status(200);
  res.json({ data: CardData });
  isSucces.save();
});

app.get('/task-api/card:CardId/', async (req, res) => {
  // get any board lists with id
  const CardId = req.params.CardId; // URL에서 :id 부분 빼오기
  const CardURL = `${trelloURL}/1/cards/${CardId}`;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list',
  });
  const Card = await axios.get(CardURL)
    .catch((error) => {
      res.status(501);
      res.json({ result: `FAILED TO GET ${id} BOARD` });
      res.json(error);
      isSucces.success = false;
    });
  const CardData = Card.data;
  res.status(200);
  res.json({ data: CardData });
  isSucces.save();
});

app.post('/api/test/lists:name:IdBoard', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const Name = req.params.name;
  const IdBoard = req.params.IdBoard;
  const ListURL = `${trelloURL}/1/lists`;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list',
  });
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
      isSucces.success = false;
      isSucces.save();
    });
    res.json({ result: 1 });
    isSucces.save();
  });
});

app.post('/api/test/lists:name:IdBoard', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const Name = req.params.name;
  const IdBoard = req.params.IdBoard;
  const ListURL = `${trelloURL}/1/lists`;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list',
  });
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
      isSucces.success = false;
      isSucces.save();
    });
    res.json({ result: 1 });
    isSucces.save();
  });
});

function GetSprintIdNameByNumber(sprintnumber, Obj, callback) {
  const Trello = require('node-trello');
  console.log('key : ', _key);
  const t = new Trello(_key, _token);
  let Flag = false;
  t.get(`/1/boards/${  boardID  }/lists`, (err, data) => {
    if (err) throw err;
    // console.log(data);
    for (let i in data) {
      // console.log(data[i].name);
      console.log(data[i].name);
      console.log(sprintnumber);
      if (String(data[i].name).includes(sprintnumber)) {
        console.log('here');
        Obj.push({ id: data[i].id, name: data[i].name });
        // Obj.id += data[i].id;
        // Obj.name += data[i].name;
        Flag = true;
        // For return all data
        // callback(200,Obj);
        // return 200, Obj;
      }
    }
    if (Flag == true) {
      callback(null, 200);
    } else {
      callback(null, 404);
    }
  });
}

function GetSprintIdNameByTitle(sprinttitle, callback) {
  const Trello = require('node-trello');
  const t = new Trello(_key, _token);
  t.get(`/1/boards/${  boardID  }/lists`, (err, data) => {
    if (err) throw err;
    // console.log(data);
    for (let i in data) {
      if (String(data[i].name) == sprinttitle) {
        // console.log(data[i].id);=

      }
    }
  });
  return -1;
}

function PrintInformation(Obj, res, callback) {
  console.log('Print information~');

  res.end(JSON.stringify(Obj));
}
// !- Veggie Avocado API !- //
// !-     Trello  API    !- //
// Just check these functions.
// Ctrl+Arlt + M = stop     < for VS code >
// Ctrl+Arlt + N = Start    < expension is needed >
app.get('/soul-api/:sprintnum/task', async (req, res) => {
  /*
  **    localhost:8080/soul-api/1(or other number)/task
  */
  // Step 1. Get the value of sprint number.
  const SprintNum = req.params.sprintnum; // URL에서 :id 부분 빼오기
  let id,
    name = '';
  const varObj = [{ id: '', name: '' }]; // for Pass by reference
  let str = '1st Sprint';
  async = require('async');
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/:sprintnum/task',
  });
  switch (SprintNum) {
    // Step 2. Get all lists of 'Sprints'
    case '1':
      str = '1st Sprint';
      break;
    case '2':
      str = '2nd Sprint';
      break;
    case '3':
      str = '3rd Sprint';
      break;
    default:
      str = `${SprintNum}th Sprint`;
      break;
  }
  async.series([GetSprintIdNameByNumber.bind(null, str, varObj)], function (err, status) {
    if (err) throw err;
    if (status == 200) {
      this.varObj = varObj;
      PrintInformation(this.varObj, res);
      isSucces.save();
    } else if (status == 404) {
      res.json({ Err: 'not found' });
      isSucces.success = false;
      isSucces.save();
    }
  });
});
// WHY?
// WHY IT NEED??  #ISSUE 50818
app.post('/soul-api/:sprintnum/:sprintname/task', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const Sprintname = req.param.sprintname;
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/:sprintnum/:sprintname/task',
  });
  const options = {
    method: 'POST',
    url: ListURL,
    qs: {
      name: Sprintname,
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
      isSucces.success = false;
      isSucces.save();
    });
    isSucces.save();
    res.json({ result: 1 });
  });
});

// update  5b40453d2599fe37cce59503
// Succeed at JUL 10
app.put('/soul-api/:sprintnum/task/:listid/:title/', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const SprintNum = req.params.sprintnum; // URL에서 :id 부분 빼오기
  const list_id = req.params.listid;
  const title = req.params.title;
  console.log('asdf', list_id, title);
  const ListURL = `https://api.trello.com/1/lists/${list_id}`;
  const request = require('request');
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/:sprintnum/task/:listid/:title/',
  });
  const options = {
    method: 'PUT',
    url: ListURL,
    qs: {
      // id : list_id,
      name: title,
      key: _key,
      token: _token,
    },
  };
  request(options, (error, response, body) => {
    // const testInst = new test();
    // testInst.LogTime = Date.getTime();
    // testInst.response = response;
    // testInst.body = body;
    if (error) {
      console.log(error);
    } else {
      console.log(response);
      res.json({ result: response });
    }
    testInst.save((error) => {
      console.log(error);
      res.json({ err: error });
      isSucces.success = false;
      isSucces.save();
    });
    res.json({ result: 'Success' });
    isSucces.save();
  });
});


// !- Veggie Avocado API !- //
// !-     Vultr API      !- //
const url = 'https://api.vultr.com/v1/server';
const vultrAPI = 'NVB3TJSPCNHBCUKS5LML4R6LJ6T7J6OZIEBQ';
const VultrAPI = require('vultr-api-wrapper');
const config = require('./.config/github');

const Vultr = new VultrAPI({ api_key: vultrAPI }); // reference is in /unittest/vultrAPITest.js


app.get('/soul-api/server', async (req, res) => {
  // get avocado board lists
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/server',
  });
  Vultr.server_list((err, status, result) => {
    if (err) {
      res.json({ Error: 'Not found' });
      res.status(404);
      isSucces.success = false;
      isSucces.save();
    } else {
      res.json(result);
      res.status(200);
      isSucces.save();
    }
  });
});

// label, ip, status
app.get('/soul-api/server/:serverid', async (req, res) => {
  // get avocado board lists
  const ServerId = req.params.serverid;
  const Response = { LABEL: '', IP: '', STATUS: '' };
  console.log(ServerId);
  res.status(404);
  const isSucces = new IsSucces({
    date: getDate(),
    success: false,
    ModuleName: '/soul-api/server/:serverid',
  });
  Vultr.server_list((err, status, result) => {
    for (i in result) {
      console.log('i', i, 'result', result[i].SUBID);
      if (result[i].SUBID == ServerId) {
        console.log('found!');
        Response.LABEL = result[i].label;
        Response.IP = result[i].main_ip;
        Response.STATUS = result[i].status;
        flag = true;
        isSucces.success = true;
        isSucces.save();
        res.status(200);
        break;
      }
    }
    isSucces.save();
    res.json(Response);
  });
});

// soul-munin : 16375998
app.get('/soul-api/server/:serverid/reinstall', async (req, res) => {
  // get avocado board lists
  const server_id = req.params.serverid;
  console.log(server_id);
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/server/:serverid/reinstall',
  });
  Vultr.server_reinstall({ SUBID: server_id }, (err, status, result) => {
    if (err) {
      console.log(err);
      res.status(404);
      res.json(err);
      isSucces.success = false;
      isSucces.save();
    } else {
      console.log('success');
      res.status(200);
      res.json(result);
      isSucces.save();
    }
  });
});

app.get('/soul-api/server/:serverid/stop', async (req, res) => {
  // get avocado board lists
  const server_id = req.params.serverid;
  console.log(server_id);
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: 'soul-api/server/:serverid/stop',
  });
  Vultr.server_halt({ SUBID: server_id }, (err, status, result) => {
    if (err) {
      console.log(err);
      res.json(err);
      res.status(404);
      isSucces.success = false;
      isSucces.save();
    } else {
      console.log('success');
      res.json(result);
      res.status(200);
      isSucces.save();
    }
  });
});


app.get('/soul-api/server/:serverid/start', async (req, res) => {
  // get avocado board lists
  const server_id = req.params.serverid;
  console.log(server_id);
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/server/:serverid/start',
  });
  Vultr.server_start({ SUBID: server_id }, (err, status, result) => {
    if (err) {
      console.log(err);
      res.json(err);
      isSucces.success = false;
      isSucces.save();
    } else {
      console.log('success');
      res.json(result);
      isSucces.save();
    }
  });
});

app.get('/soul-api/server/:serverid/reboot', async (req, res) => {
  // get avocado board lists
  const ServerId = req.params.serverid;
  console.log(ServerId);
  const isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list',
  });
  Vultr.server_reboot({ SUBID: server_id }, (err, status, result) => {
    if (err) {
      console.log(err);
      res.json(err);
      res.status(404);
      isSucces.success = false;
      isSucces.save();
    } else {
      console.log('success');
      res.json(result);
      res.status(200);
      isSucces.save();
    }
  });
});

