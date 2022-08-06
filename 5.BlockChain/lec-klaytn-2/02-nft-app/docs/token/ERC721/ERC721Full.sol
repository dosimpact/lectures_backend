pragma solidity ^0.5.0;

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "./ERC721Metadata.sol";

/**
 * @title Full ERC721 Token
 * @dev This implementation includes all the required and some optional functionality of the ERC721 standard
 * Moreover, it includes approve all functionality using operator terminology.
 *
 * See https://eips.ethereum.org/EIPS/eip-721
 */
// ERC721Metadata : 토큰의 이름과 심볼 메타 정보
// ERC721Enumerable : 토큰 발견 가능하돌고 
// 솔리디티의 다중상속에는 문제가 있다, _mint함수는 ERC721, ERC721Enumerable 모두 있다.
// - C3선형화 규칙 사용 : 뺀 오른쪽의 매서드 먼저 검색을 하게 된다.  
contract ERC721Full is ERC721, ERC721Enumerable, ERC721Metadata {
    constructor (string memory name, string memory symbol) public ERC721Metadata(name, symbol) {
        // solhint-disable-previous-line no-empty-blocks
    }
}
