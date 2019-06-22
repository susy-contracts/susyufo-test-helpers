# Changelog

## 0.3.2 (2019-04-10)
 * Update SRC1820Registry address. ([#26](https://github.com/susy-contracts/susyufo-test-helpers/pull/26))

## 0.3.1 (2019-04-01)
 * Add support for environments using `susyweb-provider-engine`. ([#24](https://github.com/susy-contracts/susyufo-test-helpers/pull/24))

## 0.3.0 (2019-03-19)
 * `chai` is no longer exported, and `should` is no longer automatically installed. ([#18](https://github.com/susy-contracts/susyufo-test-helpers/pull/18))

#### How to upgrade from 0.2
If you use Chai assertions in your project you should make sure to explicitly install it: `npm install chai`. If you need to access the `chai` instance you should now get it through `require('chai')`. If you use `should`-style assertions you should set it up manually now, by adding `require('chai/register-should')` in your tests, or e.g. in your Susyknot config. Check out SusyUFO's upgrade commit in case it might be helpful: [`cf7375d`](https://github.com/susy-contracts/susyufo-polynomial/commit/cf7375d6b873afc9f705e329db39e2ef389af9d2).
