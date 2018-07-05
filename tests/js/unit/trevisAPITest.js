/*
**  @Author   Wonseok. J
**  @Date     2018.07.02 (TUE)
**  @DETAILS  Test file for check if api is working well.
**  @HOWTODO  'yarn mocha:cov'
*/
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);
const userId = '865736';
const githubId = '40468899';
const WoobakRepositoryId = '19800635';
const url = 'https://api.travis-ci.org';
const Token = 'SQdo_Q96NNPlRyoFK8pQzA';
const SecToken = 'RzRu44CjFJc7AFySpg2rvQ';
const ExampleRequestId = '120074706';
const BuildExampleId = '398958549';

describe('GET API TEST', async() => {
    it('Get repositories test', (done)=>{
        chai.request(`${url}`)
        .get('/owner/travis-ci/repos')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          // console.log(res);
          // console.log("error: " + err)
          // expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      it('Get active test', (done)=>{
        chai.request(`${url}`)
        .get('/owner/veggieavocado/repos')
        .query({limit:5, sort_by:'name'})
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          // console.log(res.res);
        //   console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      it('Get branch test', (done)=>{
        chai.request(`${url}`)
        .get('/repo/19800635/branch/master')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          // console.log(res);
          // console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);
      
      it('Get branches test', (done)=>{
        chai.request(`${url}`)
        .get('/repo/'+WoobakRepositoryId+'/branches')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          // console.log(res);
          // console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      it('Get requests test', (done)=>{
        chai.request(`${url}`)
        .get('/repo/'+WoobakRepositoryId+'/requests')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          // console.log(res);
          // console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      it('Get messages test', (done)=>{
        chai.request(`${url}`)
        .get('/repo/'+WoobakRepositoryId+'/request/'+ExampleRequestId+'/messages')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          // console.log(res);
          // console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      it('Get builds test', (done)=>{
        chai.request(`${url}`)
        .get('/repo/'+WoobakRepositoryId+'/builds')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          // console.log(res);
          // console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      it('Get next build id', (done)=>{
        chai.request(`${url}`)
        .get('/repo/'+WoobakRepositoryId+'/builds')
        .query({after_number : BuildExampleId})
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          console.log(res);
          // console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      // You have to know your own build ID.
      // it('Build test', (done)=>{
      //   chai.request(`${url}`)
      //   .get('/repo/'+WoobakRepositoryId+'/build/' + BuildExampleId)
      //   .set('Travis-API-Version',3)
      //   .send({Authorization:(' token '+`${SecToken}`)})
      //   // .send({Travis-API-Version: 3})
      //   .end((err, res)=>{
      //     // console.log(res);
      //     // console.log("error: " + err)
      //     expect(err).to.be.null;
      //     expect(res).to.have.status(200);
      //     setTimeout(done,4000);
      //   });
      // }).timeout(8000);

      it('Get jobs', (done)=>{
        chai.request(`${url}`)
        .get('/jobs')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${SecToken}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          // console.log(res);
          // console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);
});