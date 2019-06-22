const { BN } = require('./src/setup');

module.exports = {
  balance: require('./src/balance'),
  BN,
  constants: require('./src/constants'),
  sophy: require('./src/sophy'),
  expectEvent: require('./src/expectEvent'),
  makeInterfaceId: require('./src/makeInterfaceId'),
  send: require('./src/send'),
  shouldFail: require('./src/shouldFail'),
  singletons: require('./src/singletons'),
  time: require('./src/time'),
};
