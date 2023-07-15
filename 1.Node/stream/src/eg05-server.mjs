import express from "express";
import { readFileSync, createReadStream } from "fs";
import { Readable, Transform, Writable } from "stream";
import { randomUUID } from "crypto";

const PORT = process.env.PORT || 5050;
const INDEX_1GM = 10_000_000;

// eg) server to server stream ( csv download )
// server [ read csv > http response ] >>>  client [ http request > file ] with stream pipe
// ( not object mode )

// read DB
function getUserByIdMocked(cursor) {
  const tmp = [];
  for (let i = 0; i < 100; i++) {
    const data = {
      id: randomUUID(),
      name: `User-${cursor}-${i}`,
      cursor,
      at: Date.now(),
    };
    tmp.push(JSON.stringify(data));
  }
  return `${tmp.join()}` + ",";
}

// point1.
// chunk
// - For streams not operating in object mode, chunk must be a string,
// - Buffer or Uint8Array. For object mode streams

const bootstrap = async () => {
  const app = express();

  app.get("/1-readable", (req, res) => {
    const totalCount = 1_000;

    const readableStream = Readable({
      read(size) {
        // 스트림은 버퍼가 찰때까지 read 여러번 호출하여 청크데이터를 요청한다.
        // 읽기 로직을 통해 데이터를 Push한다.
        // 다운스트림에서 데이터를 다 소화하면 다시 read가 호출된다. 이는 pipe함수에 의해 관리된다.
        console.log("-->readableStream read event");
        console.log(`ㄴcursor : ${this.currentCursor} / size : ${size}`);

        const str = getUserByIdMocked(this.currentCursor);
        this.push(str);
        this.currentCursor += 1; // 읽기 커서

        // 모든 데이터를 읽은 경우, null을 보낸다.
        if (this.currentCursor >= totalCount) {
          this.push(null); // finished
        }
      },
    });
    readableStream.currentCursor = 0;

    const progressStream = new Transform({
      transform(chunk, encoding, callback) {
        const progress =
          (readableStream.currentCursor / totalCount).toFixed(2) * 100;
        console.log(`-->progressStream ${progress}%`);
        callback(null, chunk);
      },
    });

    readableStream
      .pipe(progressStream)
      .pipe(res)
      .on("end", () => console.log("Event end"))
      .on("finish", () => console.log("Event finish"))
      .on("error", () => console.log("Event error"));
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
