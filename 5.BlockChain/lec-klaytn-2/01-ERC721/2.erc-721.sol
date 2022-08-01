// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;

// ? approve 전송권한을 왜 주는가
// 다른 일반계정 혹은 컨트렉 계정이 대신 토큰 전송을 수행할 수 있도록 해준다. (낙찰시 자동 전송)

// ? 토큰 전송 후, 전송권한 삭제를 안해도 되나? ( 토큰래벨의 전송에서 )

// ? ERC-165 도 믿음으로 가는 것?

interface ERC721 /* is ERC165 */ {

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    /* 어떤 계정에 몇개의 토큰인 있는가? */
    function balanceOf(address _owner) public view returns (uint256);
    /* 토큰ID의 소유자계정은 누구인가? */
    function ownerOf(uint256 _tokenId) public view returns (address);
    /* 토큰을 꺼내는 기능이 없는, 컨트렉주소로 입금시 코인이 증발하게 된다. 이를 해결하기 위함.  
        - 입금주소가 컨트렉 계정인 경우, ERC721 인터페이스 구현 여부를 확인한다. */
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) public;
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public;
    function transferFrom(address _from, address _to, uint256 _tokenId) public;

    function approve(address _approved, uint256 _tokenId) public;
    function getApproved(uint256 _tokenId) public view returns (address);
    function setApprovalForAll(address _operator, bool _approved) public;
    function isApprovedForAll(address _owner, address _operator) public view returns (bool);

}

/// @dev Note: the ERC-165 identifier for this interface is 0x150b7a02 -> magic value
interface ERC721TokenReceiver {
    // 함수 시그니처 - 함수이름+타입으로 암호화된 값,
    /// @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data) public returns(bytes4);
}

// 컨트렉이 어떤 인터페이스를 상속받고 있는가 확인해주는 기능
// Note: the ERC-165 identifier for this interface(ERC721) is 0x80ac58cd.
interface ERC165 {
    function supportsInterface(bytes4 interfaceID) public view returns (bool);
}


// ERC721 인터페이스 상속받음. 인터페이스 안 함수들 구현필요
contract ERC721implementation is ERC721{
    // mapping - 딕셔너리 자료구조  

    // mapping : token id - 계정주소 
    mapping (uint256 => address) tokenOwner;
    // mapping : 계정주소 - 소유한 토큰 수 
    mapping (address => uint256) ownedTokensCount;
    // (토큰레벨의 권한부여) mapping : 해당 토큰의 권한을 갖게 된 계정 저장
    mapping (uint256 => address) tokenApprovals;
    // (계정레벨의 권한부여) 누가(오너) => 누구에게(대리인) => 권한부여를 했는가
    mapping (address => mapping (address => bool)) operatorApprovals;
    // 특정 인터페이스를 쓰는가 (bytes4: 인터페이스 식별값)
    mapping (bytes4 => bool) supportsInterfaces;

    constructor () public {
        supportsInterfaces[0x80ac58cd] = true;
    }

    // 민트, 토큰 발행하기 :  _to 발행될 주소 ,_tokenId 단순히 1부터 증가
    function mint(address _to, uint _tokenId) public {
        tokenOwner[_tokenId] = _to;
        // 토큰 발행시마다 토큰 개수 +1
        ownedTokensCount[_to] += 1;
    }
    // owner를 넘기면 owner계정이 소유한 토큰의 개수 return
    function balanceOf(address _owner) public view returns (uint256) {
        return ownedTokensCount[_owner];
    }
    // tokenId를 넘기면 토큰의 주인을 return
    function ownerOf(uint256 _tokenId) public view returns (address) {
        return tokenOwner[_tokenId];
    }
    // token을 from계정에서 to계정으로 전송
    function transferFrom(address _from, address _to, uint256 _tokenId) public{
        address owner = ownerOf(_tokenId);
        // 함수 호출 계정과 owner계정이 같은지 확인 or 전송권한있는 계정인지 확인
        require(msg.sender == owner || getApproved(_tokenId) == msg.sender || isApprovedForAll(owner, msg.sender));
        // empty check, from과 to 계정이 비어있지 않아야함
        require(_from != address(0));
        require(_to != address(0));

        // from계정 토큰 개수 -1, 토큰 소유권 삭제
        ownedTokensCount[_from] -= 1;
        tokenOwner[_tokenId] = address(0);
        // to계정 토큰 개수 +1, 토큰 소유권 주기
        ownedTokensCount[_to] += 1;
        tokenOwner[_tokenId] = _to;
    }
    // contract계정으로 토큰 전송 시 contract에 토큰을 다루는 기능이 없다면 토큰 증발 -> 이 문제 해결!
    // to계정이 contract계정일 경우 ERC721 호환성이 있는지 check
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
        transferFrom(_from, _to, _tokenId);
        // constract 계정일 경우 토큰을 받을 수 있는지 확인
        if (isContract(_to)) {
            //onERC721Received에서 magic value return하는지 확인
            bytes4 returnValue = ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, '');
            require(returnValue == 0x150b7a02);
        }
    }
    // token을 contract로 보낼 때 해당 contract이 data field를 요구하는 경우
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) public {
        transferFrom(_from, _to, _tokenId);
        // constract 계정일 경우 토큰을 받을 수 있는지 확인
        if (isContract(_to)) {
            //onERC721Received에서 magic value return하는지 확인
            bytes4 returnValue = ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, data);
            require(returnValue == 0x150b7a02);
        }
    }
    // 토큰(_tokenId)을 대신 보내줄 계정(_approved)에 , "토큰 대리 전송 허용 계정이라고" 유효성을 마킹함.
    function approve(address _approved, uint256 _tokenId) public{
        // 권한을 받게되는 계정이 이미 token을 소유한 계정이 아니어야함
        // approve 함수를 호출한 계정이 tokenId의 소유자여야 함
        address owner = ownerOf(_tokenId);
        require(_approved != owner);
        require(msg.sender == owner);
        tokenApprovals[_tokenId] = _approved;
    }
    // tokenId를 받아 주소를 return
    function getApproved(uint256 _tokenId) public view returns (address) {
        // 해당 토큰의 전송 권한이 있는 계정 주소 return
        return tokenApprovals[_tokenId];
    }

    // 계정이 소유한 모든 token들을 전송할 수 있도록 권한 부여
    // operator : 권한 부여할 계정, _approved : 부여할건지의 여부
    function setApprovalForAll(address _operator, bool _approved) public {
        require(_operator != msg.sender);
        // sender가 operator에 권한을 부여할것인지 _approved 인자를 통해 mapping에 저장
        operatorApprovals[msg.sender][_operator] = _approved;
    }

    // 토큰의 소유자가 operator에게 권한을 부여했는지?
    function isApprovedForAll(address _owner, address _operator) public view returns (bool){
        return operatorApprovals[_owner][_operator];
    }

    // ERC721를 구현하고 있는지?
    function supportsInterface(bytes4 interfaceID) public view returns (bool){
        return supportsInterfaces[interfaceID];
    }

    function isContract(address _addr) private view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(_addr) }
        // 일반계정이면 size = 0, 스마트 컨트랙계정이면 size > 0
        return size > 0;
    }
}

// 경매(안정성을 위한 중계)를 담당하는 contract
// 컨트랙이 onERC721Received 을 구현했다고, 그 컨트렉이 안정한것은 아니다. 다만 암묵적인 약속(믿음)으로 가는 것.  
constract Auction is ERC721TokenReceiver{
    /* 데이터 히스토리, 유효성 검증, 회계 기록 등의 기능으로, 아래 함수를 확장 시킬 수 있다. */
    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data) public returns(bytes4){
        // 0x150b7a02 return
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

    function checkSupportsInterface(address _to, bytes4 interfaceID) public view returns (bool) {
        return ERC721implementation(_to).supportsInterface(interfaceID);
    }
}