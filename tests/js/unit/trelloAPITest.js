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

const url = 'https://api.trello.com';
const TestSpaceListVar = '5b39d61ac9ccf35c981d2f1a';
const TestCardId = 'xbwwNz5G';

/*
    Fields of the board to be included in the response are,
    all, closed, dateLastActivity, dateLastView, desc, escData,
    idOrganization, invitations, invited, labelNames, memberships,
    name, pinned, powerUps, prefs, shortLink, shortUrl, starred,
    subscribed, url
*/

describe('GET API TEST', async() => {
  
  it('Get board list from member test. <server test>', (done) => {
    // Just change user37475319 --> your id
    chai.request(`${url}/1/members/user37475319/boards`)
      .get('/?fields=name')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        // console.log(res);                                                                # If you want to see raw data,
        done();
      });
  });

  it('Get board\'s fields information test', (done) => {
    chai.request(`${url}/1/boards/${BoardVeggieArvocadoID}`)
      .get('?fields=id,name&lists=open&list_field=id,name')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        // console.log(res);
        done();
      });
  });

  it('Get board api', (done) => {
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
  
  it('Get list api', (done)=>{
    chai.request(`${url}`)
    .get('/1/boards/'+BoardVeggieArvocadoID)
    .send({fields:'id, name', lists:'open', list_fields:'id, name, closed, pos'})
    .end((err, res)=>{
      // console.log(res);
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })
  })


  it('Get list api', (done)=>{
    chai.request(`${url}`)
    .get('/1/lists/' + TestSpaceListVar )
    .send({key:'b99f16d67481b93e65e19d84f64806ab',
    token:'1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53',})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });

  it('Get list api<list-id>', (done)=>{
    chai.request(`${url}`)
    .get('/1/lists/' + TestSpaceListVar )
    .send({key:'b99f16d67481b93e65e19d84f64806ab',
    token:'1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53'})
    .end((err, res)=>{
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });

  it('Get card api', (done)=>{
    chai.request(`${url}`)
    .get('/1/lists/'+TestSpaceListVar+'/cards')
    .send({key:'b99f16d67481b93e65e19d84f64806ab',
           token:'1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53',
           fields:'name'})
    .end((err, res)=>{
      // console.log(res);
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });

  it('Get card api<card_id>', (done)=>{
    chai.request(`${url}`)
    .get('/1/cards/'+TestCardId)
    .send({key:'b99f16d67481b93e65e19d84f64806ab',
    token:'1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53',
    fields:'all'})
    .end((err, res)=>{
      // console.log(res);
      expect(err).to.be.null;
      expect(res).to.have.status(200);
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

  // list랑 card를 아예 타겟해서 정보 가져오거나 수정하는 것도 가능하더라고
  // https://developers.trello.com/reference#lists
  // https://developers.trello.com/reference#cards-1
});

describe("POST api test", async() => {
  const _key = 'b99f16d67481b93e65e19d84f64806ab';
  const _token = '1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53';
  const _testidBoard = '5b27804acfb5b8b8392dbc08';
  it('List post api test', (done) =>{
    chai.request(`${url}`)
    .post('/1/lists')
    // .set('key','b99f16d67481b93e65e19d84f64806ab')
    // .set('token','1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53')
    .send({key:'b99f16d67481b93e65e19d84f64806ab',
    token:'1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53',
      name:'POST API TESTED', idBoard:`5b27804acfb5b8b8392dbc08`})
    .end((err, res) => {
      // console.log(res);
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });

  it('Card post api test', (done)=>{
    chai.request(`${url}`)
    .post('/1/cards')
    .send({key:'b99f16d67481b93e65e19d84f64806ab',
      token:'1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53',
      idList:TestSpaceListVar,
      keepFromSource:'all',
      name:'CARD POST API TEST'})
      .end((err, res) => {
        // console.log(res);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      })
  });
});

describe("PUT API TEST", async()=>{
  it('List put api test', (done) => {
    chai.request(`${url}`)
    .put('/1/lists/'+TestSpaceListVar)
    .send({key:'b99f16d67481b93e65e19d84f64806ab',
    token:'1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53',
    name:'PUT API TESTED',})
    .end((err, res) =>{
      // console.log(res);
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })
  });
  it('Card put api test', (done) =>{
    chai.request(`${url}`)
    .put('/1/cards/'+TestCardId)
    .send({key:'b99f16d67481b93e65e19d84f64806ab',
    token:'1212888ff2d1140637a2e9f0db08c011ca4ad13345fb9bf06ae2018447e9ee53',
    name:'PUT API UPDATE TESTED',})
    .end((err, res) =>{
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })
  })
  // it('Card put api test', (done) => {
  //   chai.request(`${url}`)
  //   .put('/1/cards/'+)
  // });
});