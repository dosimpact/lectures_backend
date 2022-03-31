const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");
const NETWORK_ID = "1001"; // baobao 고유 network ID
const GASLIMIT = "20000000";
const URL = `https://api.baobab.klaytn.net:8651`; // klaytn의 플로드, testnet
const PRIVATE_KEY = ""; // test계정의 비밀키

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },

    klaytn: {
      provider: new HDWalletProvider(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
  },
};
