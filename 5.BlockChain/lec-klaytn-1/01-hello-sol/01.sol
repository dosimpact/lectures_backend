// solidity 0.8.7
pragma solidity 0.8.7;

contract AdditionGame {
    address public owner;

    // call - owner address
    constructor() public {
        owner = msg.sender;
    }
}
