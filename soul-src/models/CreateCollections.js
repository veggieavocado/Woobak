// reference: https://velopert.com/594

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const url = 'mongodb://localhost:27017/woobak';
const MongoClient = require('mongodb').MongoClient;


const TaskSchema = new Schema({
  developerid: {
    type: Schema.ObjectId, // Foreign key at Developer
    ref: 'DeveloperSchema',
  },
  testid: {
    type: Schema.ObjectId, // Foreign Key at Test
    ref: 'TestSchema',
  },
  branch: String,
  importance: Number,
  description: String,
  taskid: {
    type: Number, // Primary key at Task
    unique: true,
  },
});

const TestSchema = new Schema({
  testid: {
    type: Number, // Primary key of Test
    unique: true,
  },
  build_num: Number,
  buildresult: String,
  taskid: Number, // Foreign key at Task
});

const DeveloperSchema = new Schema({
  developerid: {
    type: Number, // Primary key of Developer
    unique: true,
  },
  position: Number, // 1=PM, 2=Dev, 3=Ops
  status: Boolean, // 1=On, 0=Off
  name: String,
});

const PositionSchema = new Schema({
  positionid: {
    type: Number, // 1, 2, ... <Primary key>
    unique: true,
  },
  position: String, // PM . . .
});


MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  console.log('Database connected!');
  // module.exports = mongoose.model('position', PositionSchema);
  // module.exports = mongoose.model('developer', DeveloperSchema);
  // module.exports = mongoose.model('test', TestSchema);
  // module.exports = mongoose.model('task', TaskSchema);

  const dbo = db.db('woobak');
  dbo.createCollection('developers', (err, res) => {
    if (err) {
      console.log('error occur!');
      throw err;
    }
  });
  dbo.createCollection('task', (err, res) => {
    if (err) {
      console.log('error occur!');
      throw err;
    }
  });
  dbo.createCollection('test', (err, res) => {
    if (err) {
      console.log('error occur!');
      throw err;
    }
  });
  dbo.createCollection('position', (err, res) => {
    if (err) {
      console.log('error occur!');
      throw err;
    }
    db.close();
  });
});

// const Schema = mongoose.Schema;

// const testSchema = new Schema({
//   date: { type: Date, default: Date.now },
//   author: String,
//   content: String,
// });

// module.exports = mongoose.model('test', testSchema);
