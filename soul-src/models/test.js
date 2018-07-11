const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const testSchema = new Schema({
  date: { type: Date, default: Date.now },
  author: String,
  content: String,
});

module.exports = mongoose.model('test', testSchema);
