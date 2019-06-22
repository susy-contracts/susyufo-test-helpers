const chai = require('chai');
const BN = susyweb.utils.BN;

chai.use(require('chai-bn')(BN));

module.exports = {
  BN,
};
