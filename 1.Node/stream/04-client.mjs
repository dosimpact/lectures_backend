import express from "express";
import { readFileSync, createReadStream, createWriteStream } from "fs";
import { Readable, Writable, Duplex, Transform } from "stream";
import { randomUUID } from "crypto";
import { get } from "http";

const url = "http://localhost:5050/1-readable";

const getHttpStream = () =>
  new Promise((resolve) => get(url, (response) => resolve(response)));
const stream = await getHttpStream();

stream
  .pipe(
    Transform({
      readableObjectMode: true,
      writableObjectMode: true,
      transform(chunk, enc, cb) {
        console.log("-->chunk", chunk);

        const item = JSON.parse(chunk);
        console.log("chunk", JSON.parse(chunk));

        const myNumber = /\d+/.exec(item.name)[0];
        const isEven = myNumber % 2 === 0;
        item.name = item.name.concat(isEven ? " is even" : " is odd");

        cb(null, JSON.stringify(item));
      },
    })
  )
  .filter((chunk) => chunk.includes("even"))
  .map((chunk) => chunk.toUpperCase() + "\n")
  .pipe(
    // flag A => append data if existent
    createWriteStream("response.log", { flags: "a" })
  );
