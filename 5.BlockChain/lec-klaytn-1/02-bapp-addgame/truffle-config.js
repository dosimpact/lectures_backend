const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");
const NETWORK_ID = "1001"; // baobao 고유 network ID
const GASLIMIT = "20000000";
const URL = `https://api.baobab.klaytn.net:8651`; // klaytn의 플로드, testnet
const PRIVATE_KEY =
  "0xaae7ae750b02116cb1b094aaf94f11a77ecd60497dc545d0cfec318a4136e48c"; // test계정의 비밀키

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    klaytn: {
      provider: new HDWalletProvider(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    },
  },
};
// - contarct deploy
// npx truffle deploy --network klaytn

// - re deploy
// npx truffle deploy --compile-all --reset --network klaytn
