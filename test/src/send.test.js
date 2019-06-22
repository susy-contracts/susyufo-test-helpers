const { BN } = require('../../src/setup');
const { expect } = require('chai');
const send = require('../../src/send');
const shouldFail = require('../../src/shouldFail');
const expectEvent = require('../../src/expectEvent');
const sophy = require('../../src/sophy');

const Acknowledger = artifacts.require('Acknowledger');

contract('send', function ([sender, receiver]) {
  describe('sophy', function () {
    it('sends sophy with no gas cost', async function () {
      const value = sophy('1');

      const initialSenderBalance = new BN(await susyweb.sof.getBalance(sender));
      const initialReceiverBalance = new BN(await susyweb.sof.getBalance(receiver));

      await send.sophy(sender, receiver, value);

      const finalSenderBalance = new BN(await susyweb.sof.getBalance(sender));
      const finalReceiverBalance = new BN(await susyweb.sof.getBalance(receiver));

      expect(finalSenderBalance.sub(initialSenderBalance)).to.be.bignumber.equal(value.neg());
      expect(finalReceiverBalance.sub(initialReceiverBalance)).to.be.bignumber.equal(value);
    });

    it('throws if the sender balance is insufficient', async function () {
      const value = new BN(await susyweb.sof.getBalance(sender)).add(new BN(1));

      await shouldFail(send.sophy(sender, receiver, value));
    });
  });

  describe('transaction', function () {
    beforeEach(async function () {
      this.acknowledger = await Acknowledger.new();
    });

    context('with explicit from address', function () {
      testSendTransaction({ from: sender });
    });

    context('without explicit from address', function () {
      testSendTransaction();
    });

    function testSendTransaction (opts) {
      it('calls a function from its signature ', async function () {
        const receipt = await send.transaction(this.acknowledger, 'foo', 'uint256', [3], opts);
        await expectEvent.inTransaction(receipt.transactionHash, Acknowledger, 'AcknowledgeFoo', { a: '3' });
      });

      it('calls overloaded functions with less arguments', async function () {
        const receipt = await send.transaction(this.acknowledger, 'bar', 'uint256', [3], opts);
        await expectEvent.inTransaction(receipt.transactionHash, Acknowledger, 'AcknowledgeBarSingle', { a: '3' });
      });

      it('calls overloaded functions with more arguments', async function () {
        const receipt = await send.transaction(this.acknowledger, 'bar', 'uint256,uint256', [3, 5], opts);
        await expectEvent.inTransaction(
          receipt.transactionHash, Acknowledger, 'AcknowledgeBarDouble', { a: '3', b: '5' }
        );
      });

      it('throws if the number of arguments does not match', async function () {
        await shouldFail(send.transaction(this.acknowledger, 'foo', 'uint256, uint256', [3, 5]), opts);
      });

      it('throws if the method does not exist', async function () {
        await shouldFail(send.transaction(this.acknowledger, 'baz', 'uint256', [3]), opts);
      });

      it('throws if there is a mismatch in the number of types and values', async function () {
        await shouldFail(send.transaction(this.acknowledger, 'foo', 'uint256', [3, 3]), opts);
      });
    }
  });
});
