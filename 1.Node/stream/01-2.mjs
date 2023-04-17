import { Transform } from "stream";

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
