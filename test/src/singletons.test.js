const { expect } = require('chai');
const singletons = require('../../src/singletons');
const { SRC1820_REGISTRY_BYTECODE } = require('../../src/data');

contract('singletons', function ([funder]) {
  describe('SRC1820Registry', function () {
    before(async function () {
      this.registry = await singletons.SRC1820Registry(funder);
    });

    it('returns a susyknot-contract instance', function () {
      expect(this.registry.constructor.name).to.equal('SusyknotContract');
    });

    it('the registry is stored at the correct address', function () {
      expect(this.registry.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
    });

    it('stores the correct code at the registry address', async function () {
      expect((await susyweb.sof.getCode(this.registry.address))).to.equal(SRC1820_REGISTRY_BYTECODE);
    });

    it('returns the same susyknot-contract when attempting to deploy a second registry', async function () {
      const newRegistry = await singletons.SRC1820Registry(funder);
      expect(newRegistry.address).to.equal('0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24');
    });
  });
});
