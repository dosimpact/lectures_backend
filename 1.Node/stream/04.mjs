import express from "express";
import { readFileSync, createReadStream } from "fs";
import { Readable } from "stream";
import { randomUUID } from "crypto";

const PORT = process.env.PORT || 5050;

const INDEX_1GM = 10_000_000;

function* dataProvider(cursor) {
  for (let index = 0; index <= 100; index++) {
    const data = {
      id: randomUUID(),
      name: `User-${cursor}-${index}`,
      at: Date.now(),
    };
    yield data;
  }
}

const bootstrap = async () => {
  const app = express();

  app.get("/1-readable", (req, res) => {
    const readableStream = Readable({
      read() {
        console.log("-->read event -- ", this.currentCursor);
        for (const data of dataProvider(this.currentCursor)) {
          this.push(JSON.stringify(data).concat("\n"));
        }
        this.currentCursor += 1;
        if (this.currentCursor >= 20) {
          this.push(null); // finished
        }
      },
      objectMode: false,
    });

    readableStream.currentCursor = 10;

    readableStream
      .pipe(res)
      .on("end", () => {
        console.log("end");
      })
      .on("finish", () => {
        readableStream.currentCursor = 10;
        console.log("finish");
      })
      .on("error", () => console.log("error"));
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();

// read event 가 1번 밖에 안일어난다...
