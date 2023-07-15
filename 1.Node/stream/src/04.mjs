import express from "express";
import { readFileSync, createReadStream } from "fs";
import { Readable, Transform, Writable } from "stream";
import { randomUUID } from "crypto";

const PORT = process.env.PORT || 5050;
const INDEX_1GM = 10_000_000;

// read csv and load to memory
function dataProvider(cursor) {
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
  return tmp.toString();
}

// goal
// server [ read csv > string response ] >>>  client [ string recived > file ] with stream pipe

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
        console.log(
          `-->read event / cursor : ${this.currentCursor} / size:${size}`
        );

        // 스트림은 버퍼가 찰때까지 read 여러번 호출하여 버퍼를 Push한다.
        const str = dataProvider(this.currentCursor);
        this.push(str);
        this.currentCursor += 1;

        if (this.currentCursor >= totalCount) {
          this.push(null); // finished
        }
      },
      // objectMode: true,
      // highWaterMark: 16, // default 16 ( objectMode )
    });
    readableStream.currentCursor = 0;

    const progressStream = new Transform({
      transform(chunk, encoding, callback) {
        const progress = (readableStream.currentCursor / totalCount) * 100;

        console.log(`-->${progress}%`);
        callback(null, chunk);
      },
      // writableObjectMode: true,
      // readableObjectMode: true,
    });

    readableStream
      .pipe(progressStream)
      .pipe(res)
      .on("end", () => console.log("end"))
      .on("finish", () => console.log("finish"))
      .on("error", () => console.log("error"));
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
