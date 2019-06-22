const sophy = require('./sophy');
const send = require('./send');

const {
  SRC1820_REGISTRY_ABI,
  SRC1820_REGISTRY_ADDRESS,
  SRC1820_REGISTRY_BYTECODE,
  SRC1820_REGISTRY_DEPLOY_TX,
} = require('./data');

const contract = require('susyknot-contract');

const SRC1820RegistryArtifact = contract({
  abi: SRC1820_REGISTRY_ABI,
  unlinked_binary: SRC1820_REGISTRY_BYTECODE, /* eslint-disable-line camelcase */
});
SRC1820RegistryArtifact.setProvider(susyweb.currentProvider);

async function SRC1820Registry (funder) {
  // Read https://sips.superstring.io/SIPS/sip-1820 for more information as to how the SRC1820 registry is deployed to
  // ensure its address is the same on all chains.

  if ((await susyweb.sof.getCode(SRC1820_REGISTRY_ADDRESS)).length > '0x0'.length) {
    return SRC1820RegistryArtifact.at(SRC1820_REGISTRY_ADDRESS);
  }

  // 0.08 sophy is needed to deploy the registry, and those funds need to be transferred to the account that will deploy
  // the contract.
  await send.sophy(funder, '0xa990077c3205cbDf861e17Fa532eeB069cE9fF96', sophy('0.08'));

  await susyweb.sof.sendSignedTransaction(SRC1820_REGISTRY_DEPLOY_TX);

  return SRC1820RegistryArtifact.at(SRC1820_REGISTRY_ADDRESS);
}

module.exports = {
  SRC1820Registry,
};
