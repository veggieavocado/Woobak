// reference: https://velopert.com/594

var mongoose = require('mongoose');
var db = mongoose.connection;   // CONNECT TO MONGODB SERVER
var Schema = mongoose.Schema;
var url = "mongodb://localhost:27017/woobak";
var MongoClient = require('mongodb').MongoClient;



var TaskSchema = new Schema({
    developerid: Number,        // Foreign key at Developer
    testid: Number,             // Foreign Key at Test
    branch: String,
    importance: Number,
    description: String,
    taskid: Number             // Primary key at Task
});

var TestSchema = new Schema({
    testid: Number,            // Primary key of Test
    build_num: Number,
    buildresult: String,
    taskid: Number             // Foreign key at Task
});

var DeveloperSchema = new Schema({
    developerid: Number,       // Primary key of Developer
    position: Number,          // 1=PM, 2=Dev, 3=Ops
    status: Boolean,           // 1=On, 0=Off
    name: String
});

var PositionSchema = new Schema({
    positionid: Number,        // 1, 2, ... <Primary key>
    position: String           // PM . . .
});


MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    module.exports = mongoose.model('position', PositionSchema);
    module.exports = mongoose.model('developer', DeveloperSchema);
    module.exports = mongoose.model('test', TestSchema);
    module.exports = mongoose.model('task', TaskSchema);
    db.close();
})