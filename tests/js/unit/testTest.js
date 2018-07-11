const { sayHello } = require('../../../js-src/mhTest.js')

const chai = require('chai');
const expect = chai.expect;

describe('mhTest', () => {

  it('금방 만든 함수가 작동한다', (done) => {
    const helloString = sayHello()
    expect(helloString).to.equal('hi himh')
    done()
  })

})
