pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

/* 여러 컨트렉들을 베포해서, R&R을 나누자. 
- 버전 업에 대한 부담감 감소 
- 컨트렉을 사고 파는 역할을 가진 컨트렉을 작성해보자.
- 물론, 모든 함수들을 같은 컨트렉에 넣을 수 있다.
---
- ERC721 - NFT, 의 주소를 알아야 한다.  
- */
contract TokenSales {
  ERC721Full public nftAddress; // ERC721 주소

  mapping(uint256 => uint256) public tokenPrice;

  constructor(address _tokenAddress) public {
    nftAddress = ERC721Full(_tokenAddress);// ERC721Full 타입이다.
    // ERC721Full 생성자에 주소를 넘기면, 해당 주소의 컨트렉의 함수들을 가져온다.
  }

  function setForSale(uint256 _tokenId, uint256 _price) public {
    address tokenOwner = nftAddress.ownerOf(_tokenId);
    require(tokenOwner == msg.sender, "caller is not token owner");
    require(_price > 0, "price is zero or lower");
    require(nftAddress.isApprovedForAll(tokenOwner, address(this)), "token owner did not approve TokenSales contract");
    tokenPrice[_tokenId] = _price;
  }

  function purchaseToken(uint _tokenId) public payable {
    uint256 price = tokenPrice[_tokenId];
    address tokenSeller = nftAddress.ownerOf(_tokenId);
    require(msg.value >= price, "caller sent klay lower than price");
    require(msg.sender != tokenSeller, "caller is token seller");
    address payable payableTokenSeller = address(uint160(tokenSeller));
    payableTokenSeller.transfer(msg.value);
    nftAddress.safeTransferFrom(tokenSeller, msg.sender, _tokenId);
    tokenPrice[_tokenId] = 0;
  }

  function removeTokenOnSale(uint256[] memory tokenIds) public {
    require(tokenIds.length > 0, "tokenIds is empty");
    for (uint i=0; i<tokenIds.length; i++) {
      uint256 tokenId = tokenIds[i];
      address tokenSeller = nftAddress.ownerOf(tokenId);
      require(msg.sender == tokenSeller, "caller is not token seller");
      tokenPrice[tokenId] = 0;
    }
  }
}