module.exports = {
  networks: {
    susybraid: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    },
  },

  compilers: {
    polc: {
      version: '0.4.24',
    },
  },
};
