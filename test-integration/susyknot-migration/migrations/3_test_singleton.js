module.exports = async function(deployer, network, accounts) {
  const { singletons } = require('susyufo-test-helpers');

  await singletons.SRC1820Registry(accounts[0]);

  console.error('Successfully deployed the SRC1820 registry');
};
