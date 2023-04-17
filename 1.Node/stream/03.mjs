import express from "express";
import { readFileSync, createReadStream } from "fs";
import { Readable } from "stream";
import { randomUUID } from "crypto";

const PORT = process.env.PORT || 5050;

const INDEX_1GM = 10_000_000;

let index = 0;

function* dataProvider() {
  for (; index <= 10_000; index++) {
    const data = {
      id: randomUUID(),
      name: `User-${index}`,
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
        console.log("-->read event");
        for (const data of dataProvider()) {
          this.push(JSON.stringify(data).concat("\n"));
        }
        this.push(null); // finished
      },
      objectMode: true,
    });

    readableStream
      .pipe(res)
      .on("end", () => {
        console.log("end");
        index = 0;
      })
      .on("finish", () => console.log("finish"))
      .on("error", () => console.log("error"));
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();

// read event 가 1번 밖에 안일어난다...
