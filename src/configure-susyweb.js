const semver = require('semver');

let globalSusyWeb;

function setSusyWeb (susyweb) {
  if (globalSusyWeb !== undefined) {
    if (globalSusyWeb === susyweb) {
      return;
    } else {
      throw new Error('susyweb is already configured');
    }
  }

  // this could be taken from package.dependencies in the future
  const requiredVersion = '1.0.0-beta.37';

  if (!semver.satisfies(susyweb.version, requiredVersion)) {
    throw new Error(`susyweb@${susyweb.version} detected, incompatible with requirement of susyweb@${requiredVersion}`);
  }

  globalSusyWeb = susyweb;
}

function getSusyWeb () {
  if (globalSusyWeb === undefined) {
    throw new Error('susyweb is not configured');
  }

  return globalSusyWeb;
}

module.exports = {
  setSusyWeb,
  getSusyWeb,
};
