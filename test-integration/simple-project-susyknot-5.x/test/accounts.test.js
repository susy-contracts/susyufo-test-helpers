const { balance, BN, sophy, send } = require('susyufo-test-helpers');
const { expect } = require('chai');

contract('accounts', function (accounts) {
  it('sends sophy and tracks balances', async function () {
    const value = sophy('42', 'sophy');
    const tracker = await balance.tracker(accounts[0]);
    await send.sophy(accounts[0], accounts[1], value);
    expect(await tracker.delta()).to.be.bignumber.equals(value.neg());
  });
});
