"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _http = _interopRequireDefault(require("http"));

var _ws = _interopRequireDefault(require("ws"));

var _express = _interopRequireDefault(require("express"));

var app = (0, _express["default"])();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", _express["default"]["static"](__dirname + "/public"));
app.get("/", function (_, res) {
  return res.render("home");
});
app.get("/*", function (_, res) {
  return res.redirect("/");
});

var handleListen = function handleListen() {
  return console.log("Listening on http://localhost:3000");
};

var server = _http["default"].createServer(app);

var wss = new _ws["default"].Server({
  server: server
});

function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

var sockets = [];
wss.on("connection", function (socket) {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", function (msg) {
    var message = JSON.parse(msg);

    switch (message.type) {
      case "new_message":
        sockets.forEach(function (aSocket) {
          return aSocket.send("".concat(socket.nickname, ": ").concat(message.payload));
        });

      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});
server.listen(3000, handleListen);