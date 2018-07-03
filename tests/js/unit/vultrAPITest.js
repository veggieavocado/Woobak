const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const url = 'https://api.vultr.com/v1/server';
const vultrAPI = 'NVB3TJSPCNHBCUKS5LML4R6LJ6T7J6OZIEBQ';

// Import the Vultr API wrapper module
var VultrAPI = require( 'vultr-api-wrapper' );

// Create an instance with your Vultr API key
var Vultr = new VultrAPI( { api_key: vultrAPI } );

Vultr.server_list( function(error, statuscode, result){
    console.log(error);
    console.log(result);
});
describe("Show server list test", function(){
    it('Show all servers..', function(){
        Vultr.server_list( function(error, statuscode, result){
            console.log(error);
            console.log(result);
            expect(statuscode).to.have.status(200);
        });
    });
});

describe("Show OS Lists", function(){
    it('Show all server OS Lists ...', function(){
        Vultr.os_list(function(error, status, result){
        //     console.log("I am here!");
        //     console.log(error);
        //     console.log(result);
        //     console.log(status);
            expect(statuscode).to.have.status(200);
        });
    });
});

describe("Show DCID Lists", function(){
    it('Show all DCID Lists ...', function(){
        Vultr.regions_list(function(error, status, result){
            // console.log("I am here!");
            // console.log(error);
            // console.log(result);
            // console.log(status);
            expect(statuscode).to.have.status(200);
        });
    });
});


describe("Create server test", function(){
    it('check the details.... ', function(){
        Vultr.server_create({DCID:40, VPSPLANID:1, OSID:253}, function(error, statuscode, result){
            console.log("I am here!");
            console.log(error);
            console.log(result);
            expect(statuscode).to.have.status(200);
        });
    });
});