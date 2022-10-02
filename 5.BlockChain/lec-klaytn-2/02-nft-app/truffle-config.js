const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");

const NETWORK_ID = "1001";
const GASLIMIT = "20000000";
const URL = `https://api.baobab.klaytn.net:8651`;
const PRIVATE_KEY =
  "0x8e45db73fed200119f2f3ae0e99f9141ecc4493afcbd6c2ff0747cf03d1fff18";

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
