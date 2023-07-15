import express from "express";
import { readFileSync, createReadStream, createWriteStream } from "fs";
import { Readable, Writable, Duplex, Transform } from "stream";
import { randomUUID } from "crypto";
import { get } from "http";

const bootstrap = async () => {
  const file = readFileSync("response.json", { encoding: "utf8", flag: "r" });
  //   console.log(file);
  // const parsed = JSON.parse(file);
  //   console.log("-->file", parsed.length);
  try {
    const res = JSON.parse(`[${file.toString()}]`);
  } catch (error) {
    console.log("-->parsing error");
  }
};

bootstrap();
