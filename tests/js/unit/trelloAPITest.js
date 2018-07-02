// TEST STARTS HERE
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const url = 'http://api.trello.com/1/boards/b99f16d67481b93e65e19d84f64806ab'

describe('Request test', async () => {
  it('request to server', done => {
    chai.request(url)
        .get('/')
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            done();
        });
  });
});

//   it('Board get request ', async (done) => {
//     var request = require('request');

//     let options = {
//  method: 'GET',
//       url: 'https://api.trello.com/1/boards/b99f16d67481b93e65e19d84f64806ab/?fields=all',
//       qs:
//       {
//         key: 'b99f16d67481b93e65e19d84f64806ab',
//         token: '1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53'
//  } 
// };

//     chai.request(request(options, (error, response, body) => {
//     if (error) throw new(error);
//     console.log(body);
//   }));
//   });
// });
