const fs = require('fs');
const YouTubeThumbnailToken = artifacts.require('./YouTubeThumbnailToken.sol');
const { deployed } = require('./common/deployed');

module.exports = function (deployer) {
  // constructor args
  var name = 'Youtube Thumbnail';
  var symbol = 'YTT';

  deployer.deploy(YouTubeThumbnailToken, name, symbol).then(() => {
    deployed('YouTubeThumbnailToken', YouTubeThumbnailToken);
  });
};
