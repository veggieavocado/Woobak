const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

describe('Array', () => {
  it('should start empty', () => {
    const arr = [];

    assert.equal(arr.length, 0);
  });
});
