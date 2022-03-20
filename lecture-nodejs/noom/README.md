# package

```
yarn add -D @babel/cli @babel/node @babel/core @babel/runtime @babel/preset-env
yarn add -D @babel/plugin-transform-runtime
yarn add -D nodemon
yarn add express pug ws
yarn add socket.io
```

# 2.0 SocketIO vs WebSockets

SocketIO https://www.npmjs.com/package/socket.io

    Reliability

    Auto-reconnection support

    Disconnection detection

    Binary support

# 2.1 Installing SocketIO (07:51)

# 2.2 SocketIO is Amazing (10:15)

```js
// client 측에서 enter_room 이라는 커스텀 이벤트를 발행
socket.emit("enter_room", { payload: input.value }, () => {
  console.log("server is done!");
});

// server 에서는 이를 받아서 처리 후 콜백함수로 응답해준다.
socket.on("enter_room", (msg, done) => {
  console.log(msg);
  setTimeout(() => {
    done();
  }, 10000);
});
```

# 2.3 Recap (11:55)

# 2.4 Rooms (11:35)

# 2.5 Room Messages (07:01)

# 2.6 Room Notifications (13:20)

# 2.7 Nicknames (09:44)

# 2.8 Room Count part One (15:23)

# 2.9 Room Count part Two (08:10)

# 2.10 User Count (07:26)

# 2.11 Admin Panel (06:13)
