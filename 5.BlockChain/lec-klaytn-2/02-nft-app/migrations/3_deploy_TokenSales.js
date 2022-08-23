const YouTubeThumbnailToken = artifacts.require("./YouTubeThumbnailToken.sol");
const TokenSales = artifacts.require("./TokenSales.sol");
const fs = require("fs");

module.exports = function (deployer) {
  // 베포한 nft주소를 생성자로 넘겨서, 세일즈 컨트렉을 베포한다.
  deployer.deploy(TokenSales, YouTubeThumbnailToken.address).then(() => {
    if (TokenSales._json) {
      fs.writeFile(
        "deployedABI_TokenSales",
        JSON.stringify(TokenSales._json.abi),
        (err) => {
          if (err) throw err;
          console.log("파일에 ABI 입력 성공");
        }
      );
    }

    fs.writeFile("deployedAddress_TokenSales", TokenSales.address, (err) => {
      if (err) throw err;
      console.log("파일에 주소 입력 성공");
    });
  });
};
