const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);

  try {
    require('susyufo-test-helpers/configure')({ susyweb });

    console.error('Successfully configured SusyWeb instance');
  } catch (e) {
    throw new Error(`Could not configure SusyWeb instance.\n${e}`);
  }
};
