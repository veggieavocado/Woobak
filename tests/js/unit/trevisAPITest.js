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
const url = 'api.travis-ci.com';
const Token = 'SQdo_Q96NNPlRyoFK8pQzA';
const SecToken = 'RzRu44CjFJc7AFySpg2rvQ';

describe('GET API TEST', async() => {
    it('Get repositories test', (done)=>{
        chai.request(`${url}`)
        .get('/owner/travis-ci/repos')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${Token}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
        //   console.log(res);
        //   console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      it('Get active test', (done)=>{
        chai.request(`${url}`)
        .get('/owner/veggieavocado/active')
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${Token}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
        //   console.log(res);
        //   console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);

      it('Get repository test', (done)=>{
        chai.request(`${url}`)
        .get('/repos/'+WoobakRepositoryId)
        .set('Travis-API-Version',3)
        .send({Authorization:(' token '+`${Token}`)})
        // .send({Travis-API-Version: 3})
        .end((err, res)=>{
          console.log(res);
        //   console.log("error: " + err)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          setTimeout(done,4000);
        });
      }).timeout(8000);
      
});