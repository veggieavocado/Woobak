// reference: https://velopert.com/594
const mongoose = require('mongoose');

const mongodb = 'mongodb://127.0.0.1/test';
mongoose.connect(mongodb);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//  !-- PP Example -- //
// const Schema = mongoose.Schema;

// const testSchema = new Schema({
//   date: { type: Date, default: Date.now },
//   author: String,
//   content: String,
// });

// module.exports = mongoose.model('test', testSchema);
