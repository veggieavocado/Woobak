const assert = require('assert');
const { testFunc } = require('../../js-src/exampleTest.js');

describe('testFunc()', () => {
  it('should return "testing string"', async () => {
    const returnString = testFunc();
    assert.equal(returnString, 'testing string');
  });
});
