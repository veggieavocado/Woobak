// reference: https://velopert.com/594

var mongoose = require('mongoose');
var db = mongoose.connection;   // CONNECT TO MONGODB SERVER
var Schema = mongoose.Schema;
var url = "mongodb://localhost:27017/woobak";
var MongoClient = require('mongodb').MongoClient;



var TaskSchema = new Schema({
    developerid: {
        type:Schema.ObjectId,        // Foreign key at Developer
        ref:'DeveloperSchema'
    },
    testid: {
        type:Schema.ObjectId,             // Foreign Key at Test
        ref:'TestSchema'
    },
    branch: String,
    importance: Number,
    description: String,
    taskid: {
        type:Number,             // Primary key at Task
        unique : true
    }
});

var TestSchema = new Schema({
    testid: {
        type:Number,            // Primary key of Test
        unique : true
    },
    build_num: Number,
    buildresult: String,
    taskid: Number             // Foreign key at Task
});

var DeveloperSchema = new Schema({
    developerid: {
        type:Number,       // Primary key of Developer
        unique:true
    },
    position: Number,          // 1=PM, 2=Dev, 3=Ops
    status: Boolean,           // 1=On, 0=Off
    name: String
});

var PositionSchema = new Schema({
    positionid: {
        type:Number,        // 1, 2, ... <Primary key>
        unique:true
    },
    position: String           // PM . . .
});

mongoose.exports = mongoose.model('Developer', DeveloperSchema);
mongoose.exports = mongoose.model('Position', PositionSchema);
mongoose.exports = mongoose.model('Test',TestSchema);
mongoose.exports = mongoose.model('Task', TaskSchema);