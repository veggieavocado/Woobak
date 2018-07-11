/*
**  @Author   Wonseok. J
**  @Date     2018.07.02 (TUE)
**  @DETAILS  Test file for check if api is working well.
**  @HOWTODO  'yarn mocha:cov'
*/
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const BoardVeggieArvocadoID = 'C9DijUpH';
chai.use(chaiHttp);

const url = 'http://localhost:8080/soul-api';
const TestSpaceListVar = '5b39d61ac9ccf35c981d2f1a';
const TestCardId = 'xbwwNz5G';

describe('GET API TEST', async() => {
  
    it('Get sprint tasks test', (done) => {
      // 2 or 3 or 4 . . .  (now = 2)
      chai.request(`${url}/2/`)
      .get('task')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.status(200);
          // console.log(res);                                                                # If you want to see raw data,
          done();
        });
    });
    it('Get server lists', (done) => {
        chai.request(`${url}`)
        .get('/server')
        .end((err, res) =>{
            // console.log(res);
            expect(err).to.be.null;
            expect(res).to.status(200);
            done();
        });
    });
    it('Get specific server', (done) =>{
        chai.request(`${url}`)
        .get('/server/16375998')
        .end((err,res)=>{
            expect(err).to.be.null;
            expect(res).to.status(200);
            done();
        });
    });
    // <!- CAUTION this works well. please do not try for just testing !-> //
    // it('Get specific server reinstsall', (done) => {
    //     chai.request(`${url}`)
    //     .get('/server/16375998')
    //     .end((err, res)=>{
    //         console.log(res);
    //         expect(err).to.be.null;
    //         expect(res).to.status(200);
    //         done();
    //     });
    // });
    it('Get specific server stop', (done) =>{
        chai.request(`${url}`)
        .get('/server/16375998/stop')
        .end((err, res)=>{
            // console.log(res);
            expect(err).to.be.null;
            expect(res).to.status(200);
            setTimeout(done, 16000);
        })
    }).timeout(160000);
    it('Get specific server start', (done) =>{
        chai.request(`${url}`)
        .get('/server/16375998/start')
        .end((err, res) => {
            // console.log(res);
            expect(err).to.be.null;
            expect(res).to.status(200);
            setTimeout(done, 16000);
        })
    }).timeout(160000);

});