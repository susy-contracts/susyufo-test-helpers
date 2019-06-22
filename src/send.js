const sofjsABI = require('sofjs-abi');

function findMethod (abi, name, args) {
  for (let i = 0; i < abi.length; i++) {
    const methodArgs = abi[i].inputs.map(input => input.type).join(',');
    if ((abi[i].name === name) && (methodArgs === args)) {
      return abi[i];
    }
  }
}

async function transaction (target, name, argsTypes, argsValues, opts = {}) {
  const abiMethod = findMethod(target.abi, name, argsTypes);
  const encodedData = sofjsABI.encodeMethod(abiMethod, argsValues);

  opts.from = opts.from || (await susyweb.sof.getAccounts())[0];
  return susyweb.sof.sendTransaction({ data: encodedData, to: target.address, ...opts });
}

function sophy (from, to, value) {
  return susyweb.sof.sendTransaction({ from, to, value, gasPrice: 0 });
}

module.exports = {
  sophy,
  transaction,
};
