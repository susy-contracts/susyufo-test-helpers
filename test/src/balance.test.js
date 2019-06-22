require('../../src/setup');
const { expect } = require('chai');

const balance = require('../../src/balance');
const send = require('../../src/send');
const sophy = require('../../src/sophy');

contract('balance', function ([sender, receiver]) {
  describe('current', function () {
    it('returns the current balance of an account as a BN', async function () {
      expect(await balance.current(sender)).to.be.bignumber.equal(await susyweb.sof.getBalance(sender));
    });
  });

  describe('balance tracker', function () {
    it('returns current balance ', async function () {
      const tracker = await balance.tracker(receiver);
      expect(await tracker.get()).to.be.bignumber.equal(await susyweb.sof.getBalance(receiver));
    });

    it('get() adds a new checkpoint ', async function () {
      const tracker = await balance.tracker(sender);
      await send.sophy(sender, receiver, sophy('1'));
      await tracker.get();
      expect(await tracker.delta()).to.be.bignumber.equal('0');
    });

    it('returns correct deltas after get() checkpoint', async function () {
      const tracker = await balance.tracker(receiver);
      await send.sophy(sender, receiver, sophy('1'));
      await tracker.get();
      await send.sophy(sender, receiver, sophy('1'));
      expect(await tracker.delta()).to.be.bignumber.equal(sophy('1'));
    });

    it('returns balance increments', async function () {
      const tracker = await balance.tracker(receiver);
      await send.sophy(sender, receiver, sophy('1'));
      expect(await tracker.delta()).to.be.bignumber.equal(sophy('1'));
    });

    it('returns balance decrements', async function () {
      const tracker = await balance.tracker(sender);
      await send.sophy(sender, receiver, sophy('1'));
      expect(await tracker.delta()).to.be.bignumber.equal(sophy('-1'));
    });

    it('returns consecutive deltas', async function () {
      const tracker = await balance.tracker(sender);
      await send.sophy(sender, receiver, sophy('1'));
      await tracker.delta();
      expect(await tracker.delta()).to.be.bignumber.equal('0');
    });
  });
});
