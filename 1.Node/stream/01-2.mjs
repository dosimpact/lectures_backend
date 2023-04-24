import { Transform } from "stream";

// goal,
// stream 의 object 모드를 사용해서, 코드로 처리 가능한 Object 단위의 스트림 파이프라인을 구성하자.
// process.stdin            // 1.사용자의 입력
//   .pipe(commaSplitter)   // 2.콤마로 분리 (출력=objectMode)
//   .pipe(arrayToObject)   // 3.Object 만들기 (입출력=objectMode)
//   .pipe(objectToString)  // 4.String으로 만들기  (입력=objectMode)
//   .pipe(process.stdout); // 5. console 출력

const commaSplitter = new Transform({
  // writableObjectMode: true, // IN - string is ok
  readableObjectMode: true, // OUT

  transform(chunk, encoding, callback) {
    console.log("-->commaSplitter chunk", chunk);
    this.push(chunk.toString().trim().split(","));
    callback();
  },
});

const arrayToObject = new Transform({
  writableObjectMode: true, // IN
  readableObjectMode: true, // OUT

  transform(chunk, encoding, callback) {
    console.log("-->arrayToObject chunk", chunk);
    const obj = {};
    for (let i = 0; i < chunk.length; i += 2) {
      obj[chunk[i]] = chunk[i + 1];
    }
    this.push(obj);
    callback();
  },
});

const objectToString = new Transform({
  writableObjectMode: true,
  // readableObjectMode: true, // OUT - string is ok
  transform(chunk, encoding, callback) {
    console.log("-->objectToString chunk", chunk);
    this.push(JSON.stringify(chunk) + "\n");
    callback();
  },
});

process.stdin
  .pipe(commaSplitter)
  .pipe(arrayToObject)
  .pipe(objectToString)
  .pipe(process.stdout);
