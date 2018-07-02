/*
**  @Author   Wonseok. J
**  @Date     2018.07.02 (TUE)
**  @DETAILS  Test file for check if api is working well.
**  @HOWTODO  'yarn mocha:cov'
*/
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const BoardVeggieArvocadoID = 'akii79A7';
chai.use(chaiHttp);

const url = 'http://api.trello.com';

describe('Request get wonseoks \'public\' board list', async () => {
  it('Get board list test.', (done) => {
    // Just change user37475319 --> your id
    chai.request(`${url}/1/members/user37475319/boards`)
      .get('/?fields=name')
    // .set('key','b99f16d67481b93e65e19d84f64806ab')                                     # don't need in this function
    // .set('token','1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53')   # don't need in this function
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        // console.log(res);                                                                # If you want to see raw data,
        //                                                                                 # Delete '//'
        done();
      });
  });
});
/*
    Fields of the board to be included in the response are,
    all, closed, dateLastActivity, dateLastView, desc, escData,
    idOrganization, invitations, invited, labelNames, memberships,
    name, pinned, powerUps, prefs, shortLink, shortUrl, starred,
    subscribed, url
*/
describe('Request get board', async () => {
  // in this test, I will jsut test board which name is 'VeggieAvocado'.
  it('Get board information', (done) => {
    chai.request(`${url}/1/boards/${BoardVeggieArvocadoID}`)
      .get('/?fields=idShort,name,idOrganization,labelNames')
      .set('key', 'b99f16d67481b93e65e19d84f64806ab')
      .set('token', '1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        // console.log(res);
        done();
      });
  });
});

/*
** Get the Lists from Verggie Arvocado Board.
** You can have data which you want via changing fields names.
** List object [ id, name, closed, idBoard, pos, subscribed]
*/
/* **********
PEEPEE: https://api.trello.com/1/boards/akii79A7/lists
위 링크도 작동하는 것으로 보임
********** */
describe('Get all lists from VeggieArvocado', async () => {
  it('It should be succeed!', (done) => {
    chai.request(`${url}/1/boards/${BoardVeggieArvocadoID}`)
      .get('?fields=id,name&lists=open&list_field=id,name')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        // console.log(res);
        done();
      });
  });

  // list랑 card를 아예 타겟해서 정보 가져오거나 수정하는 것도 가능하더라고
  // https://developers.trello.com/reference#lists
  // https://developers.trello.com/reference#cards-1
  it("also works with peepee's API URL", (done) => {
    chai.request(`${url}/1/boards/${BoardVeggieArvocadoID}/lists`)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});

const TestSpaceListVar = '5b39d61ac9ccf35c981d2f1a';
/* Test space list id is 5b39d61ac9ccf35c981d2f1a
** You have to get your own list id.
** Below test will check update well.

** ....
*/
describe('Update list\'s name to "TESTTEST"', async () => {
  // it('Update name will be succeed!', (done) => {
  //   chai.request(`${url}/1/lists/`)
  //     .put(TestSpaceListVar)
  //     .query({ name: 'TESTTEST' })
  //     .query({ key: 'b99f16d67481b93e65e19d84f64806ab' })
  //     .query({ token: '1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53' })
  //     .end((err, res) => {
  //       expect(err).to.be.not.ok;
  //       expect(res).to.have.status(200);
  //       console.log(res);
  //       done();
  //     });
  // });

  it('Update name will work with key and token in URL', (done) => {
    // url에 키랑 토큰을 넣어서 하면 해결이 되는 것 같다!! (ft. peepee)
    // https://developers.trello.com/reference#introduction : API Key & Tokens 참조
    const key = 'b99f16d67481b93e65e19d84f64806ab';
    const token = '1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53';
    chai.request(`${url}/1/lists/`)
      .put(`${TestSpaceListVar}/?key=${key}&token=${token}`)
      .query({ name: 'TESTTEST' })
      .end((err, res) => {
        expect(err).to.be.not.ok;
        expect(res).to.have.status(200);
        done();
      });
  });
});


// API testing here
describe('Trello API wrappers', (done) => {
  // test
});
