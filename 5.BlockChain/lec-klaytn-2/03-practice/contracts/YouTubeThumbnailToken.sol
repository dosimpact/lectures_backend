pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract YouTubeThumbnailToken is ERC721Full {

    struct YouTubeThumbnail {
      string author;
      string dateCreated; 
    }

    // 토큰 아이디와, YT 정보를 매핑
    mapping(uint256 => YouTubeThumbnail) youTubeThumbnails;
    // 비디오 아이디 존재성 검증 
    mapping(string => uint256) videoIdsCreated; 

    // 베포할때 이름과 심볼을 넘겨주어야 한다. 
    constructor(string memory name, string memory symbol) ERC721Full(name, symbol) public {}

    // 토큰 민트 함수 
    function mintYTT(
        string memory _videoId,
        string memory _author,
        string memory _dateCreated,
        string memory _tokenURI // 토큰의 정보를 저장한 웹주소(개인서버,클라우드,IPFS 등)
        // IPFS에 업로드한 결과를 tokenURI에 넘길것임, 토큰정보를 JSON 형식으로 만들어서 웹주소에 저장해야 한다.
        // 토큰의 메타정보를 따로 저장해서, 가스비를 줄이려고 한다. 
        // see , https://eips.ethereum.org/EIPS/eip-721 ERC721 Metadata JSON Schema
    ) public {
      require(videoIdsCreated[_videoId] == 0, "videoId has already been created");
      uint256 tokenId = totalSupply().add(1);
      youTubeThumbnails[tokenId] = YouTubeThumbnail(_author, _dateCreated);
      videoIdsCreated[_videoId] = tokenId;

      _mint(msg.sender, tokenId);
      _setTokenURI(tokenId, _tokenURI);
    }

    // 블럭체인의 정보를 불러서 보고 싶을 때
    function getYTT(uint256 _tokenId) public view returns(string memory, string memory) {
      return (youTubeThumbnails[_tokenId].author, youTubeThumbnails[_tokenId].dateCreated);
    }
    // 사용가능한 _videoId 인지 조회할 때
    function isTokenAlreadyCreated(string memory _videoId) public view returns (bool) {
      return videoIdsCreated[_videoId] != 0 ? true : false;
    }
}
