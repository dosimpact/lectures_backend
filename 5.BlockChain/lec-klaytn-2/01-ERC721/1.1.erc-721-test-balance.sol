pragma solidity >=0.4.24 <=0.5.6;

interface ERC721{
    function balanceOf(address _owner) external view returns (uint256);
    function ownerOf(uint256 _tokenId) external view returns (address);
}

contract ERC721implementation is ERC721 {
    // mapping : token id - 계정주소
    mapping(uint256 => address) tokenOwner;
    // mapping : 계정주소 - 소유한 토큰 수
    mapping(address => uint256) ownedTokensCount;

    // 민트, 토큰 발행하기
    // _to 발행될 주소
    // _tokenId 단순히 1부터 증가
    function mint(address _to, uint256 _tokenId) public {
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
}
