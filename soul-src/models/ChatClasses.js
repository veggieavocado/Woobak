const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const url = 'mongodb://localhost:27017/woobak';
const MongoClient = require('mongodb').MongoClient;


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

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  console.log('Database connected!');

  const dbo = db.db('woobak');
  dbo.createCollection('Users', (err, res) => {
    if (err) {
      console.log('Create user collection error!');
      throw err;
    }
    console.log(res);
  });
  dbo.createCollection('Chat', (err, res) => {
    if (err) {
      console.log('Create chat collection error!');
      throw err;
    }
    console.log(res);
  });
  dbo.createCollection('Session', (err, res) => {
    if (err) {
      console.log('Create session error!');
      throw err;
    }
    console.log(res);
  });
});
