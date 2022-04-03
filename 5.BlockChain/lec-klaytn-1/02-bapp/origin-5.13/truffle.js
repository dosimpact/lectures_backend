const PrivateKeyConnector = require("connect-privkey-to-provider");
const NETWORK_ID = "1001"; // baobab unique ID
const GASLIMIT = "20000000"; //
const URL = `https://api.baobab.klaytn.net:8651`; // klaytn flood
const PRIVATE_KEY = ""; // wallet's private key

module.exports = {
  networks: {
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null, // provide by baobab network
    },
  },
};

// - contarct deploy
// truffle deploy --network klaytn

// - re deploy
// truffle deploy --compile-all --reset --network klaytn
