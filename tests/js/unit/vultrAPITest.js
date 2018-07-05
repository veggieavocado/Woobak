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


describe("Show server list test", function(){
    this.timeout(5000);
    it('Show all servers..',function(done){
        Vultr.server_list( function(error, statuscode, result){
            // console.log("I am here!");
            // console.log(error);
            // console.log(result);
            expect(result).to.exist;
            done();
        });
    });
});

describe("Show OS Lists", function(){
    it('Show all server OS Lists ...', function(done){
        Vultr.os_list(function(error, status, result){
        //     console.log("I am here!");
        //     console.log(error);
        //     console.log(result);
        //     console.log(status);
        expect(result).to.exist;
        done();
        });
    });
});

describe("Show DCID Lists", function(){
    it('Show all DCID Lists ...', function(done){
        Vultr.regions_list(function(error, status, result){
            // console.log("I am here!");
            // console.log(error);
            // console.log(result);
            // console.log(status);
            expect(result).to.exist;
            done();
        });
    });
});


// this test Success!
// but after u test, delete the server!





describe("Show plan lists", function(){
    it('check the plans.... ', function(done){
        Vultr.plans_list( function(error, statuscode, result){
            // console.log("I am here!");
            // // console.log(error);
            // // console.log(result);
            // console.log('statuscode:' + statuscode)
            expect(result).to.exist;
            done();
        });
    });
});


// API TEST COMPLETE
// DANGER.

// describe.only("Delete Server", function(){
//     it('Delete the test server.... ',function(done){
//         Vultr.server_destroy( {SUBID: 16925589}, function(error, statusCode, result){
//             console.log("I am here!");
//             console.log(error);
//             console.log(result);
//             console.log('statuscode:' + statusCode)
//             expect(int(statusCode)).to.be.oneOf([200,201,202]);
//             done();
//         });
//     });
// });

// describe.only("Create server test", function(){
//     it('check the details.... ', function(){
//         Vultr.server_create({DCID:40, VPSPLANID:201, OSID:253}, function(error, statuscode, result){
//             // console.log("I am here!");
//             // console.log(error);
//             // console.log(result);
//             console.log(statuscode);
//             console.log("I am here");
//             expect(statuscode).to.have.status(200);
//         })
//     });
// });
