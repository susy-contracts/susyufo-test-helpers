const { BN } = require('../../src/setup');
const { expect } = require('chai');
const sophy = require('../../src/sophy');

describe('sophy', function () {
  it('returns a BN', function () {
    expect(sophy('1')).to.be.bignumber.equal(new BN('1000000000000000000'));
  });

  it('works with negative amounts', function () {
    expect(sophy('-1')).to.be.bignumber.equal(new BN('-1000000000000000000'));
  });
});
