// solidity 0.8.7
pragma solidity 0.8.7;

contract AdditionGame {
    address public owner;

    // when contract constructed, save maker address as public
    constructor() public {
        owner = msg.sender;
    }

    // public balance
    function getBalance() public view returns (uint256) {
        // function <func name> public view returns (type)
        // this = contract
        return address(this).balance;
    }

    // payable( if send klay (Address) to (contract)  must be type payable )
    function deposit() public payable {
        // Validation check
        // only PASS - check ownerAddress ==? caller Address
        require(msg.sender == owner);
    }

    function transfer(uint256 _value) public returns (bool) {
        // only PASS - remain balance is more than requested value
        require(getBalance() >= _value);

        // +type casting
        address payable receiver = payable(msg.sender);
        // then send transfer
        receiver.transfer(_value);
        return true;
    }
}
