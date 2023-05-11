**Function visibility**

In Solidity, functions can have different levels of visibility depending on who should be able to call them:

- `public`: The function can be called from anywhere, including other contracts and external accounts.
- `external`: The function can only be called from external accounts (i.e., not from within other contracts).
- `internal`: The function can only be called from within the current contract (or contracts that inherit from it).
- `private`: The function can only be called from within the current contract.

To specify the visibility of a function, add the appropriate keyword before the function definition.

**Function state mutability**

In addition to visibility, functions in Solidity can also have different levels of state mutability depending on whether they modify the contract's state or not:

- `view`: The function does not modify the contract's state and does not require any gas to execute. It can read from the contract's state or view other contracts, but it cannot write to any state variables or send transactions.
- `pure`: The function does not read from or modify the contract's state and does not require any gas to execute. It can only perform computations on its inputs and return a value.
- `payable`: The function can receive Ether (i.e., be sent value) when called.

To specify the state mutability of a function, add the appropriate keyword after the function parameters.

**State variables**

Solidity also has the concept of state variables, which are variables that are stored permanently in the contract's storage. They can be accessed and modified by any function within the contract:

- `storage`: This is the default type of state variable. It is stored in the contract's storage and is accessible to any function within the contract.
- `memory`: This type of variable is temporary and exists only for the duration of a function call. It is used for local variables and function parameters.
- `calldata`: This type of variable is used to pass arguments to functions when calling them from outside the contract.

**Events**

Events are a way for a contract to communicate with the outside world by emitting a log message that can be observed by external systems:

```
event NewPlayer(address indexed player);

function enterRaffle() public payable {
    // ...
    emit NewPlayer(msg.sender);
}
```

Here, the `NewPlayer` event is emitted whenever a new player enters the raffle. External systems can listen for this event and take appropriate action.

**Fallback and receive functions**

The `fallback` function is executed whenever a function is called on the contract that does not exist. It can be used to handle Ether sent to the contract without a specific function call:

```
fallback() external payable {
    // handle incoming Ether
}
```

The `receive` function is a new function added in Solidity 0.6.0 that is called whenever the contract receives Ether:

```
receive() external payable {
    // handle incoming Ether
}
```

This function is called automatically whenever the contract receives Ether without a specific function call, and it can be used to handle the incoming Ether in a more secure way than the fallback function.


**Inheritance**

In Solidity, contracts can inherit from other contracts, allowing them to reuse code and state variables. Here's an example:

```
contract Base {
    uint256 private i_baseValue;

    function setBaseValue(uint256 newValue) internal {
        i_baseValue = newValue;
    }
}

contract Derived is Base {
    function doSomething() public {
        setBaseValue(42);
    }
}
```

Here, the `Derived` contract inherits from `Base`, which means it has access to the `setBaseValue` function defined in `Base`.

**Constructor**

The constructor is a special function that is executed when a contract is deployed. It is used to initialize the contract's state variables:

```
contract MyContract {
    uint256 private i_value;

    constructor(uint256 initialValue) {
        i_value = initialValue;
    }
}
```

Here, the `MyContract` constructor takes an `initialValue` parameter and sets the `i_value` state variable to that value when the contract is deployed.

**Mapping**

Mappings are a way of storing key-value pairs in Solidity. They can be used to implement data structures like dictionaries and hash tables:

```
mapping (address => uint256) private s_balances;

function setBalance(address account, uint256 balance) public {
    s_balances[account] = balance;
}

function getBalance(address account) public view returns (uint256) {
    return s_balances[account];
}
```

Here, `s_balances` is a mapping that associates an address with a uint256 value. The `setBalance` function is used to set a balance for a particular address, and the `getBalance` function is used to retrieve the balance for a given address.

**Array**

Arrays are a way of storing lists of values in Solidity:

```
uint256[] private s_values;

function addValue(uint256 newValue) public {
    s_values.push(newValue);
}

function getValue(uint256 index) public view returns (uint256) {
    return s_values[index];
}
```

Here, `s_values` is an array of uint256 values. The `addValue` function is used to add a new value to the end of the array, and the `getValue` function is used to retrieve a value from a given index in the array.

**Address**

The `address` type is used to represent Ethereum addresses in Solidity:

```
function sendEth(address payable recipient, uint256 amount) public {
    recipient.transfer(amount);
}
```

Here, `recipient` is an `address payable` parameter, which means it can receive Ether. The `sendEth` function is used to send Ether to a given address.

**Library**

Libraries are reusable pieces of code that can be shared across contracts. They are similar to classes in object-oriented programming languages:

```
library Math {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }
}

contract MyContract {
    using Math for uint256;

    function doSomething(uint256 x, uint256 y) public view returns (uint256) {
        return x.add(y);
    }
}
```

Here, the `Math` library defines an `add` function that adds two uint256 values together. The `MyContract` contract `uses` the `Math` library, which means it can call the `add` function on any uint256 value.
