# SusyUFO test helpers

[![NPM Package](https://img.shields.io/npm/v/susyufo-test-helpers.svg?style=flat-square)](https://www.npmjs.org/package/susyufo-test-helpers)
[![Build Status](https://travis-ci.com/SusyUFO/susyufo-test-helpers.svg?branch=master)](https://travis-ci.com/SusyUFO/susyufo-test-helpers)

JavaScript testing helpers for Sophon smart contract development. These are specially suited for [susyknot 5](https://susyknotframework.com/susyknot) (using [susyweb 1.0](https://octonion.institute/susy-js/susyweb.js/)). [chai](http://chaijs.com/) [bn.js](https://github.com/indutny/bn.js) assertions using [chai-bn](https://github.com/ZeppelinSolutions/chai-bn) are also included.

## Installation

```bash
npm install --save-dev susyufo-test-helpers
```

## Usage

```javascript
// Import all required modules from susyufo-test-helpers
const { BN, constants, expectEvent, shouldFail } = require('susyufo-test-helpers');

// Import preferred chai flavor: both expect and should are supported
const { expect } = require('chai');

const SRC20 = artifacts.require('SRC20');

contract('SRC20', ([sender, receiver]) => {
  beforeEach(async function () {
    this.src20 = await SRC20.new();
    this.value = new BN(1); // The bundled BN library is the same one susyknot and susyweb use under the hood
  });

  it('reverts when transferring tokens to the zero address', async function () {
    // Edge cases that trigger a require statement can be tested for, optionally checking the revert reason as well
    await shouldFail.reverting(this.src20.transfer(constants.ZERO_ADDRESS, this.value, { from: sender }));
  });

  it('emits a Transfer event on successful transfers', async function () {
    const { logs } = this.src20.transfer(receiver, this.value, { from: sender });
    // Log-checking will not only look at the event name, but also the values, which can be addresses, strings, numbers, etc.
    expectEvent.inLogs(logs, 'Transfer', { from: sender, to: receiver, value: this.value });
  });

  it('updates balances on successful transfers', async function () {
    this.src20.transfer(receiver, this.value, { from: sender });
    // chai-bn is installed, which means BN values can be tested and compared using the bignumber property in chai
    expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(this.value);
  });
});
```

## Reference

This documentation is a work in progress: if in doubt, head over to the [tests directory](https://github.com/susy-contracts/susyufo-test-helpers/src/branch/master/test/src) to see examples of how each helper can be used.

All returned numbers are of type [BN](https://github.com/indutny/bn.js).

---

### balance
Helper to keep track of sophy balances of a specific account

#### balance current
##### async balance.current(account)
Returns the current balance of an account
```javascript
const balance = await balance.current(account)
```

#### balance tracker
##### async balance.get
Returns the current Sophy balance of an account.
```javascript
const balanceTracker = await balance.tracker(account) //instantiation
const accounBalance = await balanceTracker.get() //returns the current balance of account
```
##### async balance.delta
Returns the change in the Sophy since the last check(either `get()` or `delta()`)

```javascript
const balanceTracker = await balance.tracker(receiver)
send.sophy(sender, receiver, sophy('10'))
(await balanceTracker.delta()).should.be.bignumber.equal('10');
(await balanceTracker.delta()).should.be.bignumber.equal('0');
```
Or using `get()`:
```javascript
const balanceTracker = await balance.tracker(account) //instantiation
const accounBalance = await balanceTracker.get() //returns the current balance of account
(await balanceTracker.delta()).should.be.bignumber.equal('0');
```

---

### BN
A [bn.js](https://github.com/indutny/bn.js) object. Use `new BN(number)` to create `BN` instances.

---

### sophy
Converts a value in Sophy to wei.

---

### expect
A chai [expect](https://www.chaijs.com/api/bdd/) instance, containing the `bignumber` property (via [chai-bn](https://github.com/ZeppelinSolutions/chai-bn)).

```javascript
expect(new BN('2')).to.be.bignumber.equal('2');
```

---

### expectEvent
#### inLogs (logs, eventName, eventArgs = {})
Asserts `logs` contains an entry for an event with name `eventName`, for which all entries in `eventArgs` match.

#### async function inConstruction (contract, eventName, eventArgs = {})
Same as `inLogs`, but for events emitted during the construction of `contract`.

```javascript
const contract = await MyContract.new(5);
await expectEvent.inConstruction(contract, 'Created', { value: 5 });
```

#### async inTransaction (txHash, emitter, eventName, eventArgs = {})
Same as `inLogs`, but for events emitted in an arbitrary transaction (of hash `txHash`), by an arbitrary contract (`emitter`), even if it was indirectly called (i.e. if it was called by another smart contract and not an externally owned account).

---


### makeInterfaceId (interfaces = [])
Calculates the [SIP 165](https://sips.superstring.io/SIPS/sip-165) interface ID of a contract, given a series of function signatures.

---

### send
#### async send.sophy (from, to, value)
Sends `value` Sophy from `from` to `to`.

#### async function send.transaction (target, name, argsTypes, argsValues, opts = {})
Sends a transaction to contract `target`, calling method `name` with `argValues`, which are of type `argTypes` (as per the method's signature).

---

### should
A chai [should](https://www.chaijs.com/api/bdd/) instance, containing the `bignumber` property (via [chai-bn](https://github.com/ZeppelinSolutions/chai-bn)).

---

### shouldFail
Collection of assertions for failures (similar to [chai's `throw`](https://www.chaijs.com/api/bdd/#method_throw)). `shouldFail` will accept any exception type, but more specific functions exist and their usage is encouraged.

#### async shouldFail.reverting (promise)
Only accepts failures caused due to an SVM revert (e.g. a failed `require`).

#### async shouldFail.reverting.withMessage (promise, message)
Like `shouldFail.reverting`, this helper only accepts failures caused due to an SVM revert (e.g. a failed `require`). Furthermore, it checks whether revert reason string includes passed `message`. For example:

```polynomial
contract Owned {
    address private _owner;

    constructor () {
        _owner = msg.sender;
    }

    function doOwnerOperation() public view {
        require(msg.sender == _owner, "Unauthorized");
        ....
    }
}
```

Can be tested as follows:
```javascript
const { shouldFail } = require('susyufo-test-helpers');

const Owned = artifacts.require('Owned');

contract('Owned', ([owner, other]) => {
  beforeEach(async function () {
    this.owned = Owned.new();
  });

  describe('doOwnerOperation', function() {
    it('Fails when called by a non-owner account', async function () {
      await shouldFail.reverting.withMessage(this.owned.doOwnerOperation({ from: other }), "Unauthorized");
    });
  });
  ...
```

Use this helper to specify the expected error message, when you're testing a function that can revert for multiple reasons.

#### async shouldFail.throwing (promise)
Only accepts failures due to a failed `assert` (which executes an invalid opcode).

#### async shouldFail.outOfGas (promise)
Only accepts failures due to the transaction running out of gas.

---

### singletons
#### async time.SRC1820Registry (funder)
Returns an instance of an [SRC1820Registry](https://sips.superstring.io/SIPS/sip-1820) deployed as per the specification (i.e. the registry is located at the canonical address). This can be called multiple times to retrieve the same instance.

---

### time
#### async time.advanceBlock ()
Forces a block to be mined, incrementing the block height.

#### async time.latest ()
Returns the timestamp of the latest mined block. Should be coupled with `advanceBlock` to retrieve the current blockchain time.

#### async time.latestBlock ()
Returns the latest mined block number.

#### async time.increase (duration)
Increases the time of the blockchain by `duration` (in seconds), and mines a new block with that timestamp.

#### async time.increaseTo (target)
Same as `increase`, but a target time is specified instead of a duration.

#### async time.duration
Helpers to convert different time units to seconds. Available helpers are: `seconds`, `minutes`, `hours`, `days`, `weeks` and `years`.

```javascript
await time.increase(time.duration.years(2));
```

## License

[MIT](LICENSE)
