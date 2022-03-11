"use strict";

var messageList = document.querySelector("ul");
var nickForm = document.querySelector("#nick");
var messageForm = document.querySelector("#message");
var socket = new WebSocket("ws://".concat(window.location.host));

function makeMessage(type, payload) {
  var msg = {
    type: type,
    payload: payload
  };
  return JSON.stringify(msg);
}

function handleOpen() {
  console.log("Connected to Server ✅");
}

socket.addEventListener("open", handleOpen);
socket.addEventListener("message", function (message) {
  var li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});
socket.addEventListener("close", function () {
  console.log("Disconnected from Server ❌");
});

function handleSubmit(event) {
  event.preventDefault();
  var input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  var input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);