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
      // writableObjectMode: true,
      // readableObjectMode: true,
      transform(chunk, enc, cb) {
        const item = JSON.parse(chunk);
        console.log("-->item", item.length);
        for (const el of item) {
          const myNumber = /\d+/.exec(el.name)[0];
          const isEven = myNumber % 2 === 0;
          el.name = el.name.concat(isEven ? " is even" : " is odd");
        }
        cb(null);
      },
    })
  )
  .filter((chunk) => chunk.includes("even"))
  .map((chunk) => chunk.toUpperCase() + "\n")
  .pipe(
    // flag A => append data if existent
    createWriteStream("response.log", { flags: "a" })
  );

// 문제점 :
