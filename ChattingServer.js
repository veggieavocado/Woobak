
const express = require('express');

const app = express();
const http = require('http').Server(app); // 1
const io = require('socket.io')(http);

const Mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/woobak';
Mongoose.connect(url);
var db = Mongoose.Connection;
// db.on('error', function(err){
//     console.log("Error", err);
// });
// db.once('open', (callback) => {
//     console.log('DB Connection succeeded.');
// });
const Schema = Mongoose.Schema;
const MongoClient = require('mongodb').MongoClient;

// is in ChatClasses
const UserSchema = new Schema({
  UserPrimaryId: {
    type: Number,
    unique: true,
  },
  SessionId: {
    type: String,
    unique: true,
    ref: 'SessionSchema',
  },
  ChatRoomId: {
    type: [Number],
    ref: 'ChatSchema',
  },
  UserId: {
    type: String,
    unique: true,
  },
  UserPw: {
    type: String,
  },
});

const SessionSchema = new Schema({
  SessionId: {
    type: String,
    unique: true,
  },
  LogoutTime: {
    type: [Date],
  },
  LoginTime: {
    type: [Date],
  },
});

const ChatSchema = new Schema({
  ChatRoomId: {
    type: Number,
    unique: true,
  },
  Chat: {
    type: String,
  },
  ChatTime: {
    type: Date,
  },
  UserPrimaryId: {
    type: [Number],
    ref: 'UserSchema',
  },
});


http.listen(1685, () => {
  console.log('Chatting server is online!');
});

app.get('/Chat', (req, res) => {
  res.send({ status: 'ONLINE' });
});

function getRandId() {
  const date = new Date();
  return date.getMilliseconds();
}

const NewUserModel = Mongoose.model('Users', UserSchema);
const Session = Mongoose.model('Session', SessionSchema);
app.post('/Chat/Signin/:id/:pw/:pw2', (req, res) => {
  const id = req.params.id;
  const pw = req.params.pw;
  const pw2 = req.params.pw2;
  if (pw !== pw2) {
    res.send({ status: 'Password Notmatch' });
    res.status(400);
  } else {
    const NewUser = new NewUserModel({
      UserPrimaryId: getRandId(),
      SessionId: 'NEWUSER',
      UserId: id,
      UserPw: pw,
    });
    NewUser.save((error) => {
    console.log('saving...');
      if (error) {
        console.log(error);
        res.json({ result: 'failed!' });
      }
      console.log('Success!');
      res.json({ result: 200 });
      res.status(200);
    });
  }
});
