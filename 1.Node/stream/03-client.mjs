import express from "express";
import { readFileSync, createReadStream, createWriteStream } from "fs";
import { Readable, Writable, Duplex, Transform } from "stream";
import { randomUUID } from "crypto";
import { get } from "http";

const url = "http://localhost:5050/1-readable";

const getHttpStream = () =>
  new Promise((resolve) => get(url, (response) => resolve(response)));

const httpReadableStream = await getHttpStream();

const monitoringStream = Transform({
  transform(chunk, enc, cb) {
    cb(null, chunk);
    try {
      const res = JSON.parse(`[${chunk.toString()}]`);
    } catch (error) {
      // stream 이 온전한 JSON 단위로 온다는 보장이 없다.
      // 일부는 잘려서 뒤 늦게 청크로 합류한다.
      console.log("-->parsing error");
    }
  },
});

const fileWriteStream = createWriteStream("response.json", {
  flags: "w",
  encoding: "utf8",
});

httpReadableStream.pipe(monitoringStream).pipe(fileWriteStream);
