// solidity 0.8.7
pragma solidity 0.8.7;

contract AdditionGame {
    address public owner;

    // call - owner address
    constructor() public {
        owner = msg.sender;
    }

    // public - getBalance
    function getBalance() public view returns (uint256) {
        // function <func name> public view returns (type)
        return address(this).balance;
    }

    // payable( if send klay (Address) to (contract)  must be type payable )
    function deposit() public payable {
        // only PASS - check ownerAddress ==? caller Address
        require(msg.sender == owner); // validation check
    }
}
