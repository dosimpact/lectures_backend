const fs = require("fs");
const YouTubeThumbnailToken = artifacts.require("./YouTubeThumbnailToken.sol");
const TokenSales = artifacts.require("./TokenSales.sol");
const { deployed } = require('./common/deployed');

module.exports = function (deployer) {
  // 베포한 nft주소를 생성자로 넘겨서, 세일즈 컨트렉을 베포한다.
  deployer.deploy(TokenSales, YouTubeThumbnailToken.address).then(() => {
    deployed('TokenSales', TokenSales);
  });
};
