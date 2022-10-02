import Caver from "caver-js";
import { Spinner } from "spin.js";
// import { create } from 'ipfs-http-client';

const feePayerWallet =
  "0x8e45db73fed200119f2f3ae0e99f9141ecc4493afcbd6c2ff0747cf03d1fff18";

const config = {
  // "http://127.0.0.1:8545"
  rpcURL: "https://api.baobab.klaytn.net:8651",
};
const cav = new Caver(config.rpcURL);

// 컨트렉 인스턴스 생성
const yttContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new cav.klay.Contract(
  DEPLOYED_ABI_TOKENSALES,
  DEPLOYED_ADDRESS_TOKENSALES
);

// ipfs config
// var ipfsClient = require("ipfs-http-client");
let ipfs = null;
// ipfsClient({
//   host: "ipfs.io", // 어떤 노드에 연결할 건가? (공식: ipfs.io )
//   port: "5001",
//   protocol: "https",
// });

const App = {
  auth: {
    accessType: "keystore",
    keystore: "",
    password: "",
  },

  //#region 계정 인증

  start: async function () {
    const walletFromSession = sessionStorage.getItem("walletInstance");

    ipfs = await Ipfs.create({
      host: "ipfs.io",
      port: "5001",
      protocol: "http",
    });

    if (walletFromSession) {
      console.log("-->", walletFromSession);
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        this.changeUI(JSON.parse(walletFromSession));
      } catch (e) {
        sessionStorage.removeItem("walletInstance");
      }
    }
  },

  handleImport: async function () {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (event) => {
      try {
        if (!this.checkValidKeystore(event.target.result)) {
          $("#message").text("유효하지 않은 keystore 파일입니다.");
          return;
        }
        this.auth.keystore = event.target.result;
        $("#message").text("keystore 통과. 비밀번호를 입력하세요.");
        document.querySelector("#input-password").focus();
      } catch (event) {
        $("#message").text("유효하지 않은 keystore 파일입니다.");
        return;
      }
    };
  },

  handlePassword: async function () {
    this.auth.password = event.target.value;
  },

  handleLogin: async function () {
    if (this.auth.accessType === "keystore") {
      try {
        const privateKey = cav.klay.accounts.decrypt(
          this.auth.keystore,
          this.auth.password
        ).privateKey;
        this.integrateWallet(privateKey);
      } catch (e) {
        $("#message").text("비밀번호가 일치하지 않습니다.");
      }
    }
  },

  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

  getWallet: function () {
    if (cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0];
    }
  },

  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore);

    const isValidKeystore =
      parsedKeystore.version &&
      parsedKeystore.id &&
      parsedKeystore.address &&
      parsedKeystore.keyring;

    return isValidKeystore;
  },

  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    cav.klay.accounts.wallet.add(walletInstance);
    sessionStorage.setItem("walletInstance", JSON.stringify(walletInstance));
    this.changeUI(walletInstance);
  },

  reset: function () {
    this.auth = {
      keystore: "",
      password: "",
    };
  },

  changeUI: async function (walletInstance) {
    $("#loginModal").modal("hide");
    $("#login").hide();
    $("#logout").show();
    $(".afterLogin").show();
    $("#address").append(
      "<br>" + "<p>" + "내 계정 주소: " + walletInstance.address + "</p>"
    );
    await this.displayMyTokensAndSale(walletInstance);
    await this.displayAllTokens(walletInstance);
    await this.checkApproval(walletInstance);
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem("walletInstance");
    this.reset();
  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
  },
  //#endregion

  // 이미존재하는 토큰여부 확인.
  checkTokenExists: async function () {
    var videoId = $("#video-id").val();
    var result = await this.isTokenAlreadyCreated(videoId);

    if (result) {
      $("#t-message").text("이미 토큰화 된 썸네일입니다");
    } else {
      $("#t-message").text("토큰화 가능한 썸네일입니다");
      $(".btn-create").prop("disabled", false);
    }
  },

  createToken: async function () {
    var spinner = this.showSpinner();
    var videoId = $("#video-id").val();
    var title = $("#title").val();
    var author = $("#author").val();
    var dateCreated = $("#date-created").val();

    if (!videoId || !title || !author || !dateCreated) {
      spinner.stop();
      return;
    }

    try {
      const metaData = this.getERC721MetadataSchema(
        videoId,
        title,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      );
      // 버퍼.form  : 문자열 -> 바이너리
      const results = await ipfs.add(Buffer.from(JSON.stringify(metaData)));
      // 해쉬값을 반환 받는다, 업로드 시간이 랜덤하다.
      console.log("-->results", results);
      const hash = results.path;
      await this.mintYTT(videoId, author, dateCreated, hash);
      spinner.stop();
    } catch (err) {
      console.error(err);
      spinner.stop();
    }
  },
  /* contracts - mintYTT */
  // bapp 사용자가 가스비를 안내도록 하기
  mintYTT: async function (videoId, author, dateCreated, hash) {
    // 로그인한 월렛의 계정, 비밀키 입력
    const sender = this.getWallet();
    // 컨트랙을 베포한 주소계정
    const feePayer = cav.klay.accounts.wallet.add(feePayerWallet); // 가스비 대납계정 , 컨트렛을 베포한 계정
    // 월렛에 추가됨.

    //ref : https://docs.klaytn.foundation/dapp/sdk/caver-js/v1.4.1/api-references/caver.klay.accounts#signtransaction
    // using the promise
    const { rawTransaction: senderRawTransaction } =
      await cav.klay.accounts.signTransaction(
        {
          type: "FEE_DELEGATED_SMART_CONTRACT_EXECUTION", // 위임수수료+대납까지
          from: sender.address, // 센더계정이 호출
          to: DEPLOYED_ADDRESS, // 베포된 컨트렉 주소
          data: yttContract.methods // ABI로 인코딩해서 넘겨야 한다.
            .mintYTT(
              videoId,
              author,
              dateCreated,
              "https://ipfs.io/ipfs/" + hash // 해쉬를 붙여 업로드 - 사진 보임
            )
            .encodeABI(),
          gas: "500000", // 가스비
          value: cav.utils.toPeb("0", "KLAY"), // payable 타입일때는 1, 아닐때는 0
        },
        sender.privateKey //sender의 서명
      );

    cav.klay
      .sendTransaction({
        senderRawTransaction: senderRawTransaction, //서명이 끝난 트랜젝션
        feePayer: feePayer.address, // 공개주소
      })
      .then(function (receipt) {
        // 트랜젝션 해쉬를 잘 받았다면, 보여준다.
        if (receipt.transactionHash) {
          console.log("https://ipfs.infura.io/ipfs/" + hash);
          alert(receipt.transactionHash); // 영수증 보여줌.
          location.reload();
        }
      });
  },

  displayMyTokensAndSale: async function (walletInstance) {
    var balance = parseInt(await this.getBalanceOf(walletInstance.address));

    // UI 처리, 보유한 토큰에 따른 분기처리
    if (balance === 0) {
      $("#myTokens").text("현재 보유한 토큰이 없습니다");
    } else {
      // ERC721 Enumeralbe 인터페이스를 통해,
      // 1. totalSupply - 모든 토큰
      // 2. tokenOfOwnerByIndex -  특정 계정의 토큰
      var isApproved = await this.isApprovedForAll(
        walletInstance.address,
        DEPLOYED_ADDRESS_TOKENSALES
      );
      for (var i = 0; i < balance; i++) {
        (async () => {
          var tokenId = await this.getTokenOfOwnerByIndex(
            walletInstance.address, // 계정주소
            i // 인덱스
          );
          var tokenUri = await this.getTokenUri(tokenId); // ipfs 주소 호출
          var ytt = await this.getYTT(tokenId);
          var metadata = await this.getMetadata(tokenUri);
          var price = await this.getTokenPrice(tokenId);
          this.renderMyTokens(tokenId, ytt, metadata, isApproved, price);
          if (price > 0) {
            this.renderMyTokensSale(tokenId, ytt, metadata, price);
          }
        })();
      }
    }
  },

  displayAllTokens: async function (walletInstance) {
    var totalSupply = parseInt(await this.getTotalSupply());
    if (totalSupply === 0) {
      $("#allTokens").text("현재 발행된 토큰이 없습니다");
    } else {
      for (var i = 0; i < totalSupply; i++) {
        (async () => {
          var tokenId = await this.getTokenByIndex(i);
          var tokenUri = await this.getTokenUri(tokenId);
          var ytt = await this.getYTT(tokenId);
          var metadata = await this.getMetadata(tokenUri);
          var price = await this.getTokenPrice(tokenId);
          var owner = await this.getOwnerOf(tokenId);
          this.renderAllTokens(
            tokenId,
            ytt,
            metadata,
            price,
            owner,
            walletInstance
          );
        })();
      }
    }
  },

  renderMyTokens: function (tokenId, ytt, metadata, isApproval, price) {
    var tokens = $("#myTokens");
    var template = $("#MyTokensTemplate");
    this.getBasicTemplate(template, tokenId, ytt, metadata);

    if (isApproval) {
      if (parseInt(price) > 0) {
        template.find(".sell-token").hide();
      } else {
        template.find(".sell-token").show();
      }
    }

    tokens.append(template.html());
  },

  renderMyTokensSale: function (tokenId, ytt, metadata, price) {
    var tokens = $("#myTokensSale");
    var template = $("#MyTokensSaleTemplate");
    this.getBasicTemplate(template, tokenId, ytt, metadata);
    template
      .find(".on-sale")
      .text(cav.utils.fromPeb(price, "KLAY") + " KLAY에 판매중");
    tokens.append(template.html());
  },

  renderAllTokens: function (
    tokenId,
    ytt,
    metadata,
    price,
    owner,
    walletInstance
  ) {
    var tokens = $("#allTokens");
    var template = $("#AllTokensTemplate");
    this.getBasicTemplate(template, tokenId, ytt, metadata);

    if (parseInt(price) > 0) {
      template.find(".buy-token").show();
      template
        .find(".token-price")
        .text(cav.utils.fromPeb(price, "KLAY") + " KLAY");
      if (owner.toUpperCase() === walletInstance.address.toUpperCase()) {
        template.find(".btn-buy").attr("disabled", true);
      } else {
        template.find(".btn-buy").attr("disabled", false);
      }
    } else {
      template.find(".buy-token").hide();
    }

    tokens.append(template.html());
  },

  approve: function () {
    this.showSpinner();
    const walletInstance = this.getWallet();

    // send + 가스까지 보내는 기준은 ?
    // setApprovalForAll 함수는 payable이 아닌데.
    yttContract.methods
      .setApprovalForAll(DEPLOYED_ADDRESS_TOKENSALES, true)
      .send({
        from: walletInstance.address,
        gas: "250000",
      })
      .then(function (receipt) {
        // 영수증에 transactionHash가 있다면,
        if (receipt.transactionHash) {
          location.reload();
        }
      });
  },

  cancelApproval: async function () {
    this.showSpinner();
    const walletInstance = this.getWallet();

    const receipt = await yttContract.methods
      .setApprovalForAll(DEPLOYED_ADDRESS_TOKENSALES, false)
      .send({
        from: walletInstance.address,
        gas: "250000",
      });
    if (receipt.transactionHash) {
      await this.onCancelApprovalSuccess(walletInstance);
      location.reload();
    }
  },

  checkApproval: async function (walletInstance) {
    var isApproval = await this.isApprovedForAll(
      walletInstance.address,
      DEPLOYED_ADDRESS_TOKENSALES
    );
    if (isApproval) {
      $("#approve").hide();
    } else {
      $("#cancelApproval").hide();
    }
  },

  sellToken: async function (button) {
    var divInfo = $(button).closest(".panel-primary");
    var tokenId = divInfo.find(".panel-heading").text();
    var amount = divInfo.find(".amount").val();

    if (amount <= 0) return;

    try {
      var spinner = this.showSpinner();
      const sender = this.getWallet();
      const feePayer = cav.klay.accounts.wallet.add(feePayerWallet);

      // using the promise
      const { rawTransaction: senderRawTransaction } =
        await cav.klay.accounts.signTransaction(
          {
            type: "FEE_DELEGATED_SMART_CONTRACT_EXECUTION",
            from: sender.address,
            to: DEPLOYED_ADDRESS_TOKENSALES,
            data: tsContract.methods
              .setForSale(tokenId, cav.utils.toPeb(amount, "KLAY"))
              .encodeABI(),
            gas: "500000",
            value: cav.utils.toPeb("0", "KLAY"), // payable 타입일때는 1
          },
          sender.privateKey
        );

      cav.klay
        .sendTransaction({
          senderRawTransaction: senderRawTransaction,
          feePayer: feePayer.address,
        })
        .then(function (receipt) {
          if (receipt.transactionHash) {
            alert(receipt.transactionHash);
            location.reload();
          }
        });
    } catch (err) {
      console.error(err);
      spinner.stop();
    }
  },

  buyToken: async function (button) {
    var divInfo = $(button).closest(".panel-primary");
    var tokenId = divInfo.find(".panel-heading").text();
    var price = await this.getTokenPrice(tokenId);

    if (price <= 0) return;

    try {
      var spinner = this.showSpinner();
      const sender = this.getWallet();
      const feePayer = cav.klay.accounts.wallet.add(feePayerWallet);

      // using the promise
      const { rawTransaction: senderRawTransaction } =
        await cav.klay.accounts.signTransaction(
          {
            type: "FEE_DELEGATED_SMART_CONTRACT_EXECUTION",
            from: sender.address,
            to: DEPLOYED_ADDRESS_TOKENSALES,
            data: tsContract.methods.purchaseToken(tokenId).encodeABI(),
            gas: "500000",
            value: price, // payable 타입일때는 1
          },
          sender.privateKey
        );

      cav.klay
        .sendTransaction({
          senderRawTransaction: senderRawTransaction,
          feePayer: feePayer.address,
        })
        .then(function (receipt) {
          if (receipt.transactionHash) {
            alert(receipt.transactionHash);
            location.reload();
          }
        });
    } catch (err) {
      console.error(err);
      spinner.stop();
    }
  },

  onCancelApprovalSuccess: async function (walletInstance) {
    var balance = parseInt(await this.getBalanceOf(walletInstance.address));

    if (balance > 0) {
      var tokensOnSale = [];
      for (var i = 0; i < balance; i++) {
        var tokenId = await this.getTokenOfOwnerByIndex(
          walletInstance.address,
          i
        );
        var price = await this.getTokenPrice(tokenId);
        if (parseInt(price) > 0) tokensOnSale.push(tokenId);
      }
      if (tokensOnSale.length > 0) {
        const receipt = await tsContract.methods
          .removeTokenOnSale(tokensOnSale)
          .send({
            from: walletInstance.address,
            gas: "250000",
          });
        if (receipt.transactionHash) {
          alert(receipt.transactionHash);
        }
      }
    }
  },
  /* contracts - isTokenAlreadyCreated */
  isTokenAlreadyCreated: async function (videoId) {
    return await yttContract.methods.isTokenAlreadyCreated(videoId).call();
  },
  /* ERC721 Metadata JSON schema  */
  getERC721MetadataSchema: function (videoId, title, imgUrl) {
    return {
      title: "Asset Metadata",
      type: "object",
      properties: {
        name: {
          type: "string",
          description: videoId,
        },
        description: {
          type: "string",
          description: title,
        },
        image: {
          type: "string",
          description: imgUrl,
        },
      },
    };
  },
  /* contracts - getBalanceOf */
  // 몇개 토큰을 보유있니?
  getBalanceOf: async function (address) {
    return await yttContract.methods.balanceOf(address).call();
  },
  /* contracts - ERC721Enumerable - tokenOfOwnerByIndex */
  getTokenOfOwnerByIndex: async function (address, index) {
    return await yttContract.methods.tokenOfOwnerByIndex(address, index).call();
  },
  /* contracts -  - tokenURI */
  getTokenUri: async function (tokenId) {
    return await yttContract.methods.tokenURI(tokenId).call();
  },

  getYTT: async function (tokenId) {
    return await yttContract.methods.getYTT(tokenId).call();
  },

  getMetadata: function (tokenUri) {
    return new Promise((resolve) => {
      $.getJSON(tokenUri, (data) => {
        resolve(data);
      });
    });
  },

  getTotalSupply: async function () {
    return await yttContract.methods.totalSupply().call();
  },

  getTokenByIndex: async function (index) {
    return await yttContract.methods.tokenByIndex(index).call();
  },

  isApprovedForAll: async function (owner, operator) {
    return await yttContract.methods.isApprovedForAll(owner, operator).call();
  },

  getTokenPrice: async function (tokenId) {
    return await tsContract.methods.tokenPrice(tokenId).call();
  },

  getOwnerOf: async function (tokenId) {
    return await yttContract.methods.ownerOf(tokenId).call();
  },

  getBasicTemplate: function (template, tokenId, ytt, metadata) {
    template.find(".panel-heading").text(tokenId);
    template.find("img").attr("src", metadata.properties.image.description);
    template
      .find("img")
      .attr("title", metadata.properties.description.description);
    template.find(".video-id").text(metadata.properties.name.description);
    template.find(".author").text(ytt[0]);
    template.find(".date-created").text(ytt[1]);
  },
};

window.App = App;

window.addEventListener("load", async function () {
  App.start();
  $("#tabs").tabs().css({ overflow: "auto" });
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: "#5bc0de", // CSS color or array of colors
  fadeColor: "transparent", // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: "spinner-line-fade-quick", // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: "spinner", // The CSS class to assign to the spinner
  top: "50%", // Top position relative to parent
  left: "50%", // Left position relative to parent
  shadow: "0 0 1px transparent", // Box-shadow for the lines
  position: "absolute", // Element positioning
};
