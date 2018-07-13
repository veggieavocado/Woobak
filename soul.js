// start soul server on Soul Server in a Docker container
const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
const config = require('./.config/github.js');
// 몽고DB 사용 없이 외부 API 연결 작업을 한다
// const mongoose = require('mongoose');
//
// const Test = require('./soul-src/models/test');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const _key = config._key;
const _token = config._token;
const mongooseAddress = config.mongooseAddress;
console.log(mongooseAddress)
// MongoDB
var mongoose = require('mongoose');
mongoose.connect(mongooseAddress);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("Connection succeeded.");
});
var Schema = mongoose.Schema;
var TestSchema = new Schema({
  date: {
    type: String,
    unique: true
  },
  ModuleName: {
    type: String
  },
  success: Boolean
});
var IsSucces = mongoose.model("IsSuccess", TestSchema);


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

function getDate() {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}
app.post('/api/test', (req, res) => {
  // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
  // 저장에 성공하면 result가 1, 실패하면 0이다
  // --- PP
  // I updated that if this function succeeded to send data to mongo,
  // then save <now time> to DB.
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/api/test'
  })
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
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/board'
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
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/board/:id'
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
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list'
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
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list:id'
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
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/card:Listid/'
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
  const CardURL = `${trelloURL}/1/cards/` + CardId;
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list'
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
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list'
  });
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
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list'
  });
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
      isSucces.success = false;
      isSucces.save();
    });
    res.json({ result: 1 });
    isSucces.save();
  });
});

function GetSprintIdNameByNumber(sprintnumber, Obj, callback) {
  var Trello = require("node-trello");
  console.log("key : ", _key);
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
app.get('/soul-api/:sprintnum/task', async (req, res) => {
  /*
  **    localhost:8080/soul-api/1(or other number)/task
  */
  // Step 1. Get the value of sprint number.
  const SprintNum = req.params.sprintnum; // URL에서 :id 부분 빼오기
  var id, name = "";
  var varObj = [{ id: "", name: "" }];          // for Pass by reference
  var str = "1st Sprint";
  async = require('async');
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/:sprintnum/task'
  });
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
      isSucces.save();
    }
    else if (status == 404) {
      res.json({ Err: "not found" });
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
  const SprintNum = req.params.sprintnum; // URL에서 :id 부분 빼오기
  const Sprintname = req.param.sprintname;
  var id, name = "";
  var varObj = { id: "", name: "" };          // for Pass by reference
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/:sprintnum/:sprintname/task'
  });
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
      isSucces.success=false;
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
  var list_id = req.params.listid;
  var title = req.params.title;
  console.log("asdf", list_id, title);
  const ListURL = 'https://api.trello.com/1/lists/' + list_id;
  var request = require('request');
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/:sprintnum/task/:listid/:title/'
  });
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
      isSucces.success=false;
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
var VultrAPI = require('vultr-api-wrapper');
var Vultr = new VultrAPI({ api_key: vultrAPI });            // reference is in /unittest/vultrAPITest.js


app.get('/soul-api/server', async (req, res) => {
  // get avocado board lists
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/server'
  });
  Vultr.server_list(function (err, status, result) {
    if (err) {
      res.json({ Error: "Not found" });
      res.status(404);
      isSucces.success=false;
      isSucces.save();
    }
    else {
      res.json(result);
      res.status(200);
      isSucces.save();
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
  var isSucces = new IsSucces({
    date: getDate(),
    success: false,
    ModuleName: '/soul-api/server/:serverid'
  });
  Vultr.server_list(function (err, status, result) {
    for (i in result) {
      console.log('i', i, 'result', result[i].SUBID);
      if (result[i].SUBID == server_id) {
        console.log('found!');
        Response.LABEL = result[i].label;
        Response.IP = result[i].main_ip;
        Response.STATUS = result[i].status;
        flag = true;
        isSucces.success=true;
        isSucces.save();
        res.status(200);
        break;
      }
    }
    isSucces.save();
    res.json(Response);
  })
});

// soul-munin : 16375998
app.get('/soul-api/server/:serverid/reinstall', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  console.log(server_id);
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/server/:serverid/reinstall'
  });
  Vultr.server_reinstall({ SUBID: server_id }, function (err, status, result) {
    if (err) {
      console.log(err);
      res.status(404);
      res.json(err);
      isSucces.success = false;
      isSucces.save();
    }
    else {
      console.log('success');
      res.status(200);
      res.json(result);
      isSucces.save();
    }
  })
});

app.get('/soul-api/server/:serverid/stop', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  console.log(server_id);
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: 'soul-api/server/:serverid/stop'
  });
  Vultr.server_halt({ SUBID: server_id }, function (err, status, result) {
    if (err) {
      console.log(err);
      res.json(err);
      res.status(404);
      isSucces.success = false;
      isSucces.save();
    }
    else {
      console.log('success');
      res.json(result);
      res.status(200);
      isSucces.save();
    }
  });
});




app.get('/soul-api/server/:serverid/start', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  console.log(server_id);
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/soul-api/server/:serverid/start'
  });
  Vultr.server_start({ SUBID: server_id }, function (err, status, result) {
    if (err) {
      console.log(err);
      res.json(err);
      isSucces.success = false;
      isSucces.save();
    }
    else {
      console.log('success');
      res.json(result);
      isSucces.save();
    }
  })
});

app.get('/soul-api/server/:serverid/reboot', async (req, res) => {
  // get avocado board lists
  var server_id = req.params.serverid;
  console.log(server_id);
  var isSucces = new IsSucces({
    date: getDate(),
    success: true,
    ModuleName: '/task-api/list'
  });
  Vultr.server_reboot({ SUBID: server_id }, function (err, status, result) {
    if (err) {
      console.log(err);
      res.json(err);
      res.status(404);
      isSucces.success = false;
      isSucces.save();
    }
    else {
      console.log('success');
      res.json(result);
      res.status(200);
      isSucces.save();
    }
  })
});

const WoobakRepositoryId = config.WoobakRepositoryId;
const SecToken = config.SecToken;
const ExampleRequestId = config.ExampleRequestId;
const BuildExampleId = config.BuildExampleId;
const TravisURL = config.TravisURL;
const GithubToken = config.GithubToken;
const TravisToken = config.TravisToken;
// var Travis = require('travis-ci');
// var travis = new Travis({
//   version: '2.0.0'
// });
// travis.authenticate({
//   github_token: GithubToken
// }, function (err, res) {
//   //we've authenticated!
//   if (err) {
//     console.log(err);
//     return;
//   }
//   travis.authenticate({
//     access_token: res.access_token
//   }, function (err) {
//     if (err) console.log(err);
//     else {
//       console.log(res);
//     }
//   });
// });
// travis.auth.github.post({
//   github_token: GithubToken
// }, function (err, res) {
//   console.log(res);
// });

// // app.get('/travis-api/branch', async (req, res) => {
// //   // get avocado board lists
// //   travis.repos('woobak').branches.get(function(err, resp){
// //     console.log(resp);
// //   });
// // });

// app.get('/travis-api/branch', (req, res) => {
//   // POST할 때 받은 데이터값을 몽고디비로 보내서 저장한다
//   // 저장에 성공하면 result가 1, 실패하면 0이다
//   const ListURL = `${TravisURL}/user`;
//   var options = {
//     method: 'GET',
//     url: ListURL,
//     qs: {
//       Travis_API_Version: 3,
//       User_Agent: "API Explorer",
//       Authorization: "token SQdo_Q96NNPlRyoFK8pQzA",
//     }
//   };
//   var requests = require('request');
//   requests(options, function (error, response, body) {
//     if (error) {
//       conosole.log(err);
//     }
//     else {
//       console.log(response);
//       res.json(response);
//     }
//   });
// });