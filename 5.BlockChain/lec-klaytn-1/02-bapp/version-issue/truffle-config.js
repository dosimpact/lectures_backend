const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");
const NETWORK_ID = "1001"; // baobao 고유 network ID
const GASLIMIT = "20000000";
const URL = `https://api.baobab.klaytn.net:8651`; // klaytn의 플로드, testnet
const PRIVATE_KEY =
  "0x78391975b5fdd2c923f19f793448662140e060685c377130b0aa03f96359e473"; // test계정의 비밀키

module.exports = {
  networks: {
    klaytn: {
      provider: new HDWalletProvider(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
  },
};
