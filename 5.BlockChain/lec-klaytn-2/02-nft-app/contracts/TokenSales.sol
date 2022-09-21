pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

/* 여러 컨트렉들을 베포해서, R&R을 나누자. 객체지향
- 버전 업에 대한 부담감 감소 
- 컨트렉을 사고 파는 역할을 가진 컨트렉을 작성해보자.
- 물론, 모든 함수들을 같은 컨트렉에 넣을 수 있다.
---
- ERC721 - NFT, 의 주소를 알아야 한다.  
- */
contract TokenSales {
    ERC721Full public nftAddress; // ERC721 주소

    // 토큰의 가격, tokenId => price
    mapping(uint256 => uint256) public tokenPrice;

    constructor(address _tokenAddress) public {
        nftAddress = ERC721Full(_tokenAddress); // ERC721Full 타입이다.
        // ERC721Full 생성자에 주소를 넘기면, 해당 주소의 컨트렉의 함수들을 가져온다.
    }

    // 토큰 판매 하는 함수
    function setForSale(uint256 _tokenId, uint256 _price) public {
        // ownerOf = public or external 이여서, 접근가능
        // private, protected는 접근  불가능 ,
        address tokenOwner = nftAddress.ownerOf(_tokenId);
        // require : 소유자 이여야하고, 가격은 0초과, transfer 승인여부
        require(tokenOwner == msg.sender, "caller is not token owner");
        require(_price > 0, "price is zero or lower");
        require(
            nftAddress.isApprovedForAll(tokenOwner, address(this)),
            "token owner did not approve TokenSales contract"
        );
        //
        tokenPrice[_tokenId] = _price;
    }

    //payable 타입, 구매하기위해서 돈을 보낸다.
    // msg.value, msg.data, msg.gas, msg.sender, msg.sig ? 어디서 오는거지?
    // value가 아니라, price를 transfer 해야하는거 아닌가?
    function purchaseToken(uint256 _tokenId) public payable {
        uint256 price = tokenPrice[_tokenId];
        address tokenSeller = nftAddress.ownerOf(_tokenId); // tokenSeller (판매자)
        // 가격,
        require(msg.value >= price, "caller sent klay lower than price");
        require(msg.sender != tokenSeller, "caller is token seller");
        //  tokenSeller : address -> address payable 타입을 위해 address(uint160()) 사용
        // https://ethereum.stackexchange.com/questions/64108/whats-the-difference-between-address-and-address-payable
        address payable payableTokenSeller = address(uint160(tokenSeller));
        // 돈을 지불 하고, 토큰을 전송
        // price = 1000
        // msg.value = 2000
        payableTokenSeller.transfer(msg.value); // 2000
        nftAddress.safeTransferFrom(tokenSeller, msg.sender, _tokenId); // msg.sender (구매자) 토큰 얻음
        // 시장에 올린 토큰의 가격을 0 으로 셋업
        tokenPrice[_tokenId] = 0;
    }

    function removeTokenOnSale(uint256[] memory tokenIds) public {
        require(tokenIds.length > 0, "tokenIds is empty");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            address tokenSeller = nftAddress.ownerOf(tokenId);
            require(msg.sender == tokenSeller, "caller is not token seller");
            tokenPrice[tokenId] = 0;
        }
    }
}
