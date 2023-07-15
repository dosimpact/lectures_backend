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
    cb(null, chunk); // pass through
  },
});

const fileWriteStream = createWriteStream("response.json", {
  flags: "w",
  encoding: "utf8",
});

httpReadableStream.pipe(monitoringStream).pipe(fileWriteStream);
