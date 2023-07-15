import express from "express";
import { Readable, Transform, Writable } from "stream";
import { readFileSync, createReadStream, createWriteStream } from "fs";
import crypto from "crypto";
import zlib from "zlib";
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

const finalWriteStream = createWriteStream("eg6-response.json.gz");

userDBReadableStream
  .pipe(progressStream)
  .pipe(zlib.createGzip())
  .pipe(finalWriteStream)
  .on("finish", () => console.log("Done"));
