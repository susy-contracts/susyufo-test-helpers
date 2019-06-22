module.exports = async function(deployer, network, accounts) {
  const { send } = require('susyufo-test-helpers');

  await send.sophy(accounts[0], accounts[1], 1);

  console.error('Successfully used send helper');
};
