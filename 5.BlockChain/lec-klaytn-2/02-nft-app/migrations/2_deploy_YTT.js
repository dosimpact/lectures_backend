const YouTubeThumbnailToken = artifacts.require("./YouTubeThumbnailToken.sol");
const fs = require("fs");

module.exports = function (deployer) {
  // 솔리디티 생성자 변수
  var name = "Youtube Thumbnail";
  var symbol = "YTT";

  deployer.deploy(YouTubeThumbnailToken, name, symbol).then(() => {
    if (YouTubeThumbnailToken._json) {
      fs.writeFile(
        "deployedABI",
        JSON.stringify(YouTubeThumbnailToken._json.abi),
        (err) => {
          if (err) throw err;
          console.log("파일에 ABI 입력 성공");
        }
      );
    }

    fs.writeFile("deployedAddress", YouTubeThumbnailToken.address, (err) => {
      if (err) throw err;
      console.log("파일에 주소 입력 성공");
    });
  });
};
