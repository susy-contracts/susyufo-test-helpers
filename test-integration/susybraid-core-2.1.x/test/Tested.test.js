const { expectRevert } = require('susyufo-test-helpers');
const { expect } = require('chai');

const Tested = artifacts.require('Tested');

contract('Tested', function (accounts) {
  context('expectRevert', async function () {
    beforeEach(async function () {
      this.contract = await Tested.new();
    })

    context('with susybraid-core < 2.2.0', async function () {
      it('accepts reverts without regard to the specified reason', async function () {
        // This is the revert reason at Tested.pol:5
        const expectedMessage = 'lorem ipsum';
        // Asserting that locally installed susybraid-core is v2.1.0.
        const nodeInfo = await susyweb.sof.getNodeInfo();
        expect(nodeInfo).to.include('2.1.0');
        try {
          await this.contract.failWithRevertReason();
        }
        catch (error) {
          // Asserting that older susybraid does NOT return reason message.
          expect(error.message).to.not.include(expectedMessage);
        }
        // With that said, following revert should be accepted without regard to the specified
        // reason message.
        await expectRevert(this.contract.failWithRevertReason(), expectedMessage);
      })
    })
  })
});
