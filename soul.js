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


const _key = 'b99f16d67481b93e65e19d84f64806ab';
const _token = '1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53';
const _task_list_id = '5b40453d2599fe37cce59503';
// MongoDB
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/woobak");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("Connection succeeded.");
});
var Schema = mongoose.Schema;



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
const boardID = 'C9DijUpH'; // Sprint ID

// peepee가 작성하는 예시 API 하나
app.get('/task-api/board', async (req, res) => {
  // get avocado board lists
  console.log('he is here');
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
  console.log('okay he is here!');
  console.log(req.params.id);
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
  const CardURL = `${trelloURL}/1/cards/` + CardId;
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
  var options = {
    method: 'POST',
    url: ListURL,
    qs: {
      name: Name,
      idBoard: IdBoard,
      key: _key,
      token: _token
    }
  };
  requests(options, function (error, response, body) {
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

app.post('/api/test/lists:name:IdBoard', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const Name = req.params.name;
  const IdBoard = req.params.IdBoard;
  const ListURL = `${trelloURL}/1/lists`;
  var options = {
    method: 'POST',
    url: ListURL,
    qs: {
      name: Name,
      idBoard: IdBoard,
      key: _key,
      token: _token
    }
  };
  requests(options, function (error, response, body) {
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

function GetSprintIdNameByNumber(sprintnumber, Obj, callback) {
  var Trello = require("node-trello");
  var t = new Trello(_key, _token);
  var Flag = false;
  t.get("/1/boards/" + boardID + "/lists", function (err, data) {
    if (err) throw err;
    // console.log(data);
    for (var i in data) {
      // console.log(data[i].name);
      console.log(data[i].name);
      console.log(sprintnumber);
      if (String(data[i].name).includes(sprintnumber)) {
        console.log("here");
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
    }
    else {
      callback(null, 404);
    }
  });
}

function GetSprintIdNameByTitle(sprinttitle, callback) {
  var Trello = require("node-trello");
  var t = new Trello(_key, _token);
  t.get("/1/boards/" + boardID + "/lists", function (err, data) {
    if (err) throw err;
    // console.log(data);
    for (var i in data) {
      if (String(data[i].name) == sprinttitle) {
        // console.log(data[i].id);=

      }
    }
  });
  return -1;
}

function PrintInformation(Obj, res, callback) {
  console.log("Print information~");

  res.end(JSON.stringify(Obj));
}
// !- Veggie Avocado API !- //
// !-     Trello  API    !- //
// Just check these functions.
// Ctrl+Arlt + M = stop     < for VS code >
// Ctrl+Arlt + N = Start    < expension is needed >
app.get('/soul-api/:spirntnum/task', async (req, res) => {
  /*
  **    localhost:8080/soul-api/1(or other number)/task
  */
  // Step 1. Get the value of Spirnt number.
  const SprintNum = req.params.spirntnum; // URL에서 :id 부분 빼오기
  var id, name = "";
  var varObj = [{ id: "", name: "" }];          // for Pass by reference
  var str = "1st Sprint";
  async = require('async');
  switch (SprintNum) {
    // Step 2. Get all lists of 'Sprints'
    case '1':
      str = "1st Sprint";
      break;
    case '2':
      str = "2nd Sprint";
      break;
    case '3':
      str = "3rd Sprint";
      break;
    default:
      str = SprintNum + "th Sprint";
      break;
  }
  async.series([GetSprintIdNameByNumber.bind(null, str, varObj)], function (err, status) {
    if (err) throw err;
    if (status == 200) {
      this.varObj = varObj;
      PrintInformation(this.varObj, res);
    }
    else if (status == 404) {
      res.json({ Err: "not found" });
    }
  });
});
// WHY?
// WHY IT NEED??  #ISSUE 50818
app.post('/soul-api/:spirntnum/:sprintname/task', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const SprintNum = req.params.spirntnum; // URL에서 :id 부분 빼오기
  const Sprintname = req.param.sprintname;
  var id, name = "";
  var varObj = { id: "", name: "" };          // for Pass by reference
  var options = {
    method: 'POST',
    url: ListURL,
    qs: {
      name: Sprintname,
      idBoard: IdBoard,
      key: _key,
      token: _token
    }
  };
  requests(options, function (error, response, body) {
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

// update  5b40453d2599fe37cce59503
// Succeed at JUL 10
app.put('/soul-api/:spirntnum/task/:listid/:title/', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  const SprintNum = req.params.spirntnum; // URL에서 :id 부분 빼오기
  var list_id = req.params.listid;
  var title = req.params.title;
  console.log("asdf", list_id, title);
  const ListURL = 'https://api.trello.com/1/lists/' + list_id;
  var request = require('request');
  var options = {
    method: 'PUT',
    url: ListURL,
    qs: {
      // id : list_id,
      name: title,
      key: _key,
      token: _token
    }
  };
  request(options, function (error, response, body) {
    // const testInst = new test();
    // testInst.LogTime = Date.getTime();
    // testInst.response = response;
    // testInst.body = body;
    if (error) {
      console.log(error);
    }
    else {
      console.log(response);
      res.json({ result: response });
    }
    testInst.save((error) => {
      console.log(error);
      res.json({ err: error });
    });
    res.json({ result: 'Success' });
  });
});


// !- Veggie Avocado API !- //
// !-     Vultr API      !- //
const url = 'https://api.vultr.com/v1/server';
const vultrAPI = 'NVB3TJSPCNHBCUKS5LML4R6LJ6T7J6OZIEBQ';
var VultrAPI = require('vultr-api-wrapper');
var Vultr = new VultrAPI({ api_key: vultrAPI });            // reference is in /unittest/vultrAPITest.js


app.get('/soul-api/server', async (req, res) => {
  // get avocado board lists
  Vultr.server_list(function (err, status, result) {
    if (err) {
      res.json({ Error: "Not found" });
      res.status(404);
    }
    else {
      res.json(result);
      res.status(200);
    }
  })
});

// label, ip, status
app.get('/soul-api/server/:serverid', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  var Response = { LABEL: "", IP: "", STATUS: "" };
  var flag = false;
  console.log(server_id);
  res.status(404);
  Vultr.server_list(function (err, status, result) {
    for (i in result) {
      console.log('i', i, 'result', result[i].SUBID);
      if (result[i].SUBID == server_id) {
        console.log('found!');
        Response.LABEL = result[i].label;
        Response.IP = result[i].main_ip;
        Response.STATUS = result[i].status;
        flag = true;
        res.status(200);
        break;
      }
    }
    res.json(Response);
  })
});

// soul-munin : 16375998
app.get('/soul-api/server/:serverid/reinstall', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  console.log(server_id);
  Vultr.server_reinstall({ SUBID: server_id }, function (err, status, result) {
    if (err) {
      console.log(err);
      res.status(404);
      res.json(err);
    }
    else {
      console.log('success');
      res.status(200);
      res.json(result);
    }
  })
});

app.get('/soul-api/server/:serverid/stop', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  console.log(server_id);
  Vultr.server_halt({ SUBID: server_id }, function (err, status, result) {
    if (err) {
      console.log(err);
      res.json(err);
      res.status(404);
    }
    else {
      console.log('success');
      res.json(result);
      res.status(200);
    }
  });
});

app.get('/soul-api/server/:serverid/start', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  console.log(server_id);
  Vultr.server_start({ SUBID: server_id }, function (err, status, result) {
    if (err) {
      console.log(err);
      res.json(err);
    }
    else {
      console.log('success');
      res.json(result);
    }
  })
});

app.get('/soul-api/server/:serverid/reboot', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  console.log(server_id);
  Vultr.server_reboot({ SUBID: server_id }, function (err, status, result) {
    if (err) {
      console.log(err);
      res.json(err);
      res.status(404);
    }
    else {
      console.log('success');
      res.json(result);
      res.status(200);
    }
  })
});

// Example 
//const userId = '865736';
//const githubId = '40468899';
const WoobakRepositoryId = '19800635';
const SecToken = 'RzRu44CjFJc7AFySpg2rvQ';
const ExampleRequestId = '120074706';
const BuildExampleId = '398958549';
const TravisURL = 'https://api.travis-ci.org';
const GithubToken = '624c5ab9590891d7fb0237857f1ebcb3d34f2363';

var Travis = require('travis-ci');
var travis = new Travis({
  version: '3.0.0'
});
travis.authenticate({
  github_token: GithubToken
}, function (err) {
  if (err) {
    console.log(err);
    console.log('Travis authentificate fail!');
  }
});
travis.auth.github.post({
  github_token:GithubToken
}, function(err, res){
  if(err){
    console.log(err);
  }
  else {
    console.log(res);
  }
})
app.get('/travis-api/branch', async (req, res) => {
  // get avocado board lists
  travis.branches.get(function(err, response){
    if( err ) {
      res.status(404);
      console.log(err);
    }
    else{
      res.json(response)
      res.status(200);
    }
  });
});