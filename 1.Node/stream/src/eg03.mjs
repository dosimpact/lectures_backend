import express from "express";
import { Readable, Transform, Writable } from "stream";
import { readFileSync, createReadStream, createWriteStream } from "fs";

// eg,

function getUserByIdMocked(cursor) {
  const tmp = [];
  for (let i = 0; i < 1; i++) {
    const data = {
      name: `User-${cursor}-${i}`,
      cursor,
      at: Date.now(),
    };
    tmp.push(JSON.stringify(data));
  }
  return `${tmp.join()}` + ",";
}

const userDBReadableStream = (() => {
  const totalCount = 10;
  const readableStream = new Readable({
    read(size) {
      // console.log("-->readableStream read event");
      // console.log(`ㄴcursor : ${this.currentCursor} / size : ${size}`);

      const str = getUserByIdMocked(this.currentCursor);
      this.push(str + "\n");
      this.currentCursor += 1; // 읽기 커서

      // 모든 데이터를 읽은 경우, null을 보낸다.
      if (this.currentCursor >= totalCount) {
        this.push(null); // finished
      }
    },
  });

  readableStream.currentCursor = 0;
  readableStream.totalCount = totalCount;
  return readableStream;
})();

const progressStream = new Transform({
  transform(chunk, encoding, callback) {
    const progress =
      (
        userDBReadableStream.currentCursor / userDBReadableStream.totalCount
      ).toFixed(2) * 100;
    callback(null, chunk);
  },
});

let finalWriteStream = null;
// const finalWriteStream = createWriteStream("eg3-response.json", {
//   flags: "w",
//   encoding: "utf8",
// });

const myWritableStream = new Writable({
  write(chunk, encodeing, callback) {
    // 스트림을 다르게 설정하지 않는다면 chunk는 보통 버퍼입니다.
    // 위에서는 encoding 인자를 썼지만 보통은 무시할 수 있습니다.
    // callback은 데이터 청크를 처리한 뒤에 호출되는 함수 입니다.
    // - 쓰기를 성공했지는 여부를 알리는 신호입니다. 실패를 알리려면 에러 객체와 함께 콜백을 호출하면 됩니다.
    console.log(chunk.toString());
    callback();
  },
});

finalWriteStream = myWritableStream;

// data 이벤트: 스트림이 소비자에게 데이터 청크를 전송할때 발생합니다.
userDBReadableStream.on("data", () => {
  console.log("Event userDBReadableStream data");
});

userDBReadableStream.on("error", () => {
  console.log("Event userDBReadableStream error");
});
userDBReadableStream.on("end", () => {
  // end 이벤트: 더 이상 소비할 데이터가 없을때 발생합니다.
  console.log("Event userDBReadableStream end");
});

userDBReadableStream.on("close", () => {
  // end > close
  console.log("Event userDBReadableStream close");
});

// readable 이벤트를 수신하게 되면, read 를 직접 호출하여 관리해야 한다.
userDBReadableStream.on("readable", () => {
  console.log("Event userDBReadableStream readable");
  // There is some data to read now.
  let data;
  while ((data = userDBReadableStream.read()) !== null) {
    // console.log(data);
  }
});

// ========

// progressStream.on("pipe", () => {
//   // pipe 이벤트 : pipe 연결되면 이벤트 발생
//   console.log("Event progressStream pipe");
// });

// progressStream.on("drain", () => {
//   // drain 이벤트: 쓰기 가능한 스트림이 더 많은 데이터를 수신할 수 있다는 신호입니다.
//   console.log("Event progressStream drain");
// });

// progressStream.on("finish", () => {
//   console.log("Event progressStream finish");
// });

// progressStream.on("error", () => {
//   console.log("Event progressStream error");
// });

// progressStream.on("close", () => {
//   console.log("Event progressStream close");
// });

// progressStream.on("unpipe", () => {
//   console.log("Event progressStream unpipe");
// });

// ====
// pipe 이벤트 : pipe 연결되면 이벤트 발생
finalWriteStream.on("pipe", () => {
  console.log("Event finalWriteStream pipe");
});

// drain 이벤트: 쓰기 가능한 스트림이 더 많은 데이터를 수신할 수 있다는 신호입니다.
finalWriteStream.on("drain", () => {
  console.log("Event finalWriteStream drain");
});

finalWriteStream.on("error", () => {
  console.log("Event finalWriteStream error");
});

finalWriteStream.on("finish", () => {
  // finish 이벤트: 모든 데이터가 시스템으로 플러시 될때 생성됩니다.
  console.log("Event finalWriteStream finish");
});

finalWriteStream.on("unpipe", () => {
  // finish > unpipe > close
  console.log("Event finalWriteStream unpipe");
});

finalWriteStream.on("close", () => {
  console.log("Event finalWriteStream close");
});

userDBReadableStream.pipe(progressStream).pipe(finalWriteStream);
