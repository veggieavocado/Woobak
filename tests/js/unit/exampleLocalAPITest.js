/*
**  @Author   PeePee
**  @Date     2018.07.05 (THU)
**  @DETAILS  원석이 보고 로컬 API 테스팅할 수 있도록 도와주기 위한 코드
**  @HOWTODO  'yarn mocha:all' --> 현재 모든 테스트 성공적으로 돌아감
*/

// issue: 아직 몽고DB를 트레비스 테스트에 사용하는 방법을 모름
// 도커를 사용한 방법이 많이 사용되는 것으로 보임
// https://blog.theodo.fr/2015/11/set-up-mongodb-on-a-travis-container-2/
// 우선은 리디렉션만 필요한 api테스트이기 때문에 몽고DB 사용은 보류

// 테스트 실행하다 에러 발생하면: kill $(ps ax | grep '[j]s' | awk '{ print $1 }')
// 그리고 다시 텍스트 에디터 실행시키기
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const { app, stopServer } = require('../../../soul.js');

// 테스트 시작!!
// 모든 describe 블럭에 beforeEach와 afterEach를 꼭 추가해서 서버를
// 매번 테스트를 돌릴 떄마다 꺼주지 않으면 에러가 발생한다!! 꼭!꼭!
describe('API 테스팅 시작', () => {
  beforeEach(() => {
    this.request = chai.request(app);
    // 테스트 내부에서 this.request를 사용할 수 있게해줌
  });

  afterEach(() => {
    stopServer();
  }); // 서버를 꺼주지 않으면 에러 발생

  it('/ 요청을 받을 수 있다', () => {
    return this.request // 위에서 정의내린 chai.request(soul)
      .get('/')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json; // body-parser 라이브러리로 json구조로 변형
        expect(res.body).to.be.an('object'); // js에서는 json과 object가 같음
        expect(res.body.status).to.equal('DONE');
      });
  });

  it('이 블럭에서 두 번째 API 테스트할 수 있다', async () => {
    // 아무리 해봐도 이건 async/await 함수를 사용하지 않으면 통과하지 않음
    // 비동기식으로 처리하지말고, async를 사용해서 동기식으로 처리바람
    const res = await this.request.get('/task-api/board')
    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
  });
});

// 두 번째 테스트 예시: 트렐로 API wrapper 테스팅
describe('트렐로 API wrapper 테스트', () => {
  beforeEach(() => {
    this.request = chai.request(app);
  });

  afterEach(() => {
    stopServer();
  }); // 서버를 꺼주지 않으면 에러 발생

  it('/task-api/board GET 요청을 보낼 수 있다', async () => {
    // 위에서 한 번 사용한 테스트 한 번 더 사용
    const res = await this.request.get('/task-api/board');
    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.be.an('object');
  });
});
