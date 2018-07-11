// reference: https://velopert.com/594

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/woobak");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
    console.log("Connection succeeded.");
});
var Schema = mongoose.Schema;

var DeveloperSchema = new Schema({
    developerid: {
        type:Number,       // Primary key of Developer
        unique:true
    },
    position: Number,          // 1=PM, 2=Dev, 3=Ops
    status: Boolean,           // 1=On, 0=Off
    name: String
});

var Developer = mongoose.model("Developer", DeveloperSchema);
var Wonseok = new Developer({
    developerid : 1065,
    position:3,
    status:true,
    name:"William. J"
});

var MyungHoon = new Developer({
    developerid : 100,
    position : 2,
    status : true,
    name : "Robert. L"
});

var Hyemin = new Developer({
    developerid : 1,
    position : 2,
    status : true,
    name:"Rolly"
});

var ShiHyung = new Developer({
    developerid : 0,
    position : 1,
    status : true,
    name : "P.P"
});

Wonseok.save(function(error){
    console.log("Wonseok is saved!");
    if( error ){
        console.error(error);
    }
});
Hyemin.save(function(error){
    console.log("Hyemin is saved!");
    if( error ){
        console.error(error);
    }
});
ShiHyung.save(function(error){
    console.log("ShiHyung is saved!");
    if( error ){
        console.error(error);
    }
});
MyungHoon.save(function(error){
    console.log("Myunghoon is saved!");
    if( error ){
        console.error(error);
    }
});