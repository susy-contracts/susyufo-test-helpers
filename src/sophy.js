const { BN } = require('./setup');

function sophy (n) {
  return new BN(susyweb.utils.toWei(n, 'sophy'));
}

module.exports = sophy;
