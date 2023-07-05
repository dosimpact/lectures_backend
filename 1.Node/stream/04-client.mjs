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
        // console.log("-->chunk", chunk);
        // const item = JSON.parse(chunk);
        // console.log("-->item", Object.keys(item));
        // console.log("-->item", Object.values(item));
        cb(null, chunk);
        // try {
        // const item = JSON.parse(chunk);
        // console.log("-->item", Object.keys(item));
        // console.log("-->item", Object.values(item));
        //   console.log("-->chunk", item);
        //   cb(null, item);
        // } catch (error) {
        //   console.log("-->error", error);
        //   cb(error);
        // }
        // for (const el of item) {
        //   const myNumber = /\d+/.exec(el.name)[0];
        //   const isEven = myNumber % 2 === 0;
        //   el.name = el.name.concat(isEven ? " is even" : " is odd");
        // }
      },
    })
  )
  // .filter((chunk) => {
  //   console.log("-->", Number(chunk["cursor"]) % 2 === 0);
  //   return Number(chunk["cursor"]) % 2 === 0;
  // })
  // .map((chunk) => ({ ...chunk, name: String(chunk).toUpperCase() }))
  .pipe(
    // flag A => append data if existent
    createWriteStream("response.json", { flags: "w", encoding: "utf8" })
  );

// 문제점 :
