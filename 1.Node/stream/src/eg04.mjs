import express from "express";
import { readFileSync, createReadStream } from "fs";

const PORT = process.env.PORT || 5050;

// eg) bigFile stream server

// 1. make bigfile
// node -e "process.stdout.write(crypto.randomBytes(2e9))" > big.file

// 2. monitoring process
// htop
// - filter > mjs
// - VIRT : 가상메모리 / RES : 물리메모리 사용량 체크

// check file size
// ls -alh

// 3. download bigfile(client)
// curl localhost:5050/1-oom --output down.file
// 결과 : RES : 물리메모리 사용량 700MB까지 상승

// curl localhost:5050/2-stream --output down.file
// 결과 : RES : 물리메모리 사용량 100MB까지 상승

const bootstrap = async () => {
  const app = express();

  app.get("/1-oom", (req, res) => {
    const file = readFileSync("big.file");
    res.write(file);
    return res.end();
  });

  app.get("/2-stream", (req, res) => {
    // HTPP 응답객체는 쓰기 가능한 객체이다.
    createReadStream("big.file").pipe(res);
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
