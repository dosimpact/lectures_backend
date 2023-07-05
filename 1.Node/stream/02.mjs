import express from "express";
import { readFileSync, createReadStream } from "fs";

const PORT = process.env.PORT || 5050;

// goal
// bigFile stream server

// 1. make bigfile
// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file

// 2. download bigfile(client)
// curl localhost:5050 --output down.file

// 3. monitoring process
// htop
// - filter > mjs
// - VIRT : 가상메모리 / RES : 물리메모리 사용량 체크
// ls -alh
// - check file size

const bootstrap = async () => {
  const app = express();

  app.get("/1-oom", (req, res) => {
    const file = readFileSync("big.file");
    res.write(file);
    return res.end();
  });

  app.get("/2-stream", (req, res) => {
    createReadStream("big.file").pipe(res);
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
