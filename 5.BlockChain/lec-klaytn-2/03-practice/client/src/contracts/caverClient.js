import Caver from 'caver-js';
import {  create } from "ipfs-http-client";

const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651',
};

const cav = new Caver(config.rpcURL);

// 컨트렉 인스턴스 생성
const yttContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new cav.klay.Contract(
  DEPLOYED_ABI_TOKENSALES,
  DEPLOYED_ADDRESS_TOKENSALES,
);

// ipfs config
// const ipfsClient = require("ipfs-http-client")
const ipfs = create({
  host: "ipfs.io", // 어떤 노드에 연결할 건가? (공식: ipfs.io )
  port: "5001",
  protocol: "https",
});

export default {
  yttContract,
  tsContract,
  ipfs
}