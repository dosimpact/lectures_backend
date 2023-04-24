- [Node.js Stream](#nodejs-stream)
- [Node.js 스트림에 대해 알아야 할 모든 것|| 독점 노드 18 기능 || 에릭 웬델](#nodejs-스트림에-대해-알아야-할-모든-것-독점-노드-18-기능--에릭-웬델)
- [Node.js Stream 당신이 알아야할 모든 것](#nodejs-stream-당신이-알아야할-모든-것)
  - [스트림](#스트림)
  - [HTTP와 스트림](#http와-스트림)
  - [eg) pipe : file \> HTTP Reseponse](#eg-pipe--file--http-reseponse)
  - [nodejs 4가지 stream](#nodejs-4가지-stream)
  - [이벤트 드리븐 vs pipe](#이벤트-드리븐-vs-pipe)
  - [스트림 이벤트](#스트림-이벤트)
  - [읽기 가능한 스트림의 일시 정지 모드와 흐름 모드](#읽기-가능한-스트림의-일시-정지-모드와-흐름-모드)
  - [스트림 구현하기](#스트림-구현하기)
    - [Writable](#writable)
    - [Readable 요청이 있을 때 (on demand) push](#readable-요청이-있을-때-on-demand-push)
    - [Duplex 스트림 만들기](#duplex-스트림-만들기)
    - [Transform 스트림 만들기](#transform-스트림-만들기)
  - [스트림 오브젝트 모드](#스트림-오브젝트-모드)
  - [빌트인 트랜스폼 스트림](#빌트인-트랜스폼-스트림)
    - [eg) read file \> zip \> write file](#eg-read-file--zip--write-file)
    - [eg) read file \> zip \> progressBar \> write file](#eg-read-file--zip--progressbar--write-file)
    - [eg) read file \> zip \> passward \> progressBar \> write file](#eg-read-file--zip--passward--progressbar--write-file)
- [Fetching Millions of Rows with Streams in Node.js](#fetching-millions-of-rows-with-streams-in-nodejs)
  - [eg) pipeline - SQL \> pipe...](#eg-pipeline---sql--pipe)
- [ref](#ref)


# Node.js Stream

# Node.js 스트림에 대해 알아야 할 모든 것|| 독점 노드 18 기능 || 에릭 웬델

https://www.youtube.com/watch?v=BdePYKgrMh0


Node.js 스트림 개념

필요성  
읽어야 할 파일의 용량이 2기가 넘고, 이를 한번에 읽어서 응답해주는 서버코드를 작성한다면   
메모리에 2기가의 파일을 적재하는것이고, 이는 메모리 부족 OOM 으로 프로세스가 죽는 상황이 발생한다.

유즈케이스  
- S3의 이미지 파일을 읽어서 > 압축파일을 만들어서 > 브라우저에서 다운로드     
- 1년 소득 연간 보고서 SQL > 데이터 파싱을 거쳐 > CSV 파일을 S3에 업로드    
- 1년 소득 연간 보고서 SQL > 데이터 파싱을 거쳐 > 엑셀파일을 브라우저에서 다운로드    
- A 서버 큰 파일 읽기 > A 서버 to B 서버 stream > 큰 파일 저장 (B 서버)


파일을 작은 조각 (청크)로 분리해서 읽기 스트림에 입력하고 어떠한 처리 후 출력 스트림으로 내보낸다.

- 청크 : 파일의 작은 조각
- 파이프라인 : 스트림의 전체 구성


# Node.js Stream 당신이 알아야할 모든 것

https://jeonghwan-kim.github.io/node/2017/07/03/node-stream-you-need-to-know.html
https://jeonghwan-kim.github.io/node/2017/08/07/node-stream-you-need-to-know-2.html
https://jeonghwan-kim.github.io/node/2017/08/12/node-stream-you-need-to-know-3.html

## 스트림

스트림은 배열이나 문자열같은 데이터 컬력션  
- 메모리에 딱 맞지도 않는다  
- 외부 소스로부터 데이터를 한번에 한 청크(chunk)씩 가져올때  

## HTTP와 스트림

- 클라이어트에서는 HTTP 응답이 읽기 가능한 스트림
- 반면 서버에서는 쓰기 가능한 스트림이 됩니다

## eg) pipe : file > HTTP Reseponse

```js
server.on("request", (req, res) => {
  const src = fs.createReadStream("./big.file")
  src.pipe(res)
})
```

## nodejs 4가지 stream

읽기 가능한(readable) 스트림은 
- 소비할수 있는 데이터를 추상화한 것입니다. 예를들어 fs.createReadStream 메소드가 그렇죠.  

쓰기 가능한 (writable) 스트림은 
- 데이터를 기록할수 있는 종착점을 추상화한 것입니다. 예를 들어 fs.createWriteStream 메소드가 있죠.

듀플렉스(duplex) 스트림은 읽기/쓰기 모두 가능합니다.
- 예를 들어 TCP 소켓이 있죠.

트랜스폼(transform) 스트림은 기본적으로 듀플렉스 스트림입니다. 
- 데이터를 읽거나 기록할 때 수정/변환될수 있는 데이터죠. 
- 예를들어 gzip을 이용해 데이터를 압축하는 zlib.createGzip 스트림이 있습니다. 
- 입력은 쓰기 가능한 스트림이고 출력은 읽기 가능한 스트림인 트랜스폼 스트림을 생각할 수 있을 겁니다. 
- 트랜스폼 스트림이 *"스트림을 통해(through streams)"*라고 불리는 것을 들어 봤을 겁니다.


## 이벤트 드리븐 vs pipe

모든 스트림은 EventEmitter의 인스턴스 입니다. 
- 데이터를 읽거나 쓸 때 사용할 이벤트를 방출(emit) 합니다. 
- 하지만, pipe 메소드를 이용하면 더 간단하게 스트림 데이터를 사용할 수 있습니다.
- pipe 메소드를 사용하되, 커스터 마이징이 더 필요하면 이벤트 드리븐으로 작성  

```
reableSrc
  .pipe(transformStream1)
  .pipe(transformStream2)
  .pipe(finalWritableDest)
```

## 스트림 이벤트

pipe 메소드는 자동으로 몇가지 작업을 관리합니다.  
- 에러 처리나 파일의 끝부분 처리, 
- 어떤 스트림이 다른 것들에 비해 느리거나 빠를 경우를 처리.

```
// readable.pipe(writable)

readable.on("data", chunk => {
  writable.write(chunk)
})

readable.on("end", () => {
  writable.end()
})

```

읽기 가능한 스트림에서 가장 중요한 이벤트는 다음과 같습니다.    
- data 이벤트: 스트림이 소비자에게 데이터 청크를 전송할때 발생합니다. 
- end 이벤트: 더 이상 소비할 데이터가 없을때 발생합니다.  

쓰기 가능한 스트림에서 가장 중요한 이벤트는 다음과 같습니다.   
- drain 이벤트: 쓰기 가능한 스트림이 더 많은 데이터를 수신할 수 있다는 신호입니다.  
- finish 이벤트: 모든 데이터가 시스템으로 플러시 될때 생성됩니다.  

## 읽기 가능한 스트림의 일시 정지 모드와 흐름 모드

readable stream mode 
- 일시 정지 (Pause) 모드 : 잠깐 쉰다.(pull)
- 흐름 (flowing) 모드 : 데이터를 계속 보낸다. (push)


읽기가능한 스트림이 일시정지 모드일 때, 스트림을 읽기 위해 read() 메소드를 호출할 수 있습니다.
- 흐름 모드일 때, 만약 이것을 수신할 소비자가 없으면 데이터는 사라지게 됩니다. 
- 그렇기 때문에 흐름 모드에서 읽기 가능한 스트림이 있을 때는 data 이벤트 핸들러가 필요합니다. 
- 사실, data 이벤트 핸들러를 추가하는 것은 일시 정지된 스트림을 흐름 모드로 바꾸는 것이고, data 이벤트 핸들러를 제거하는 것은 일시 정지 모드로 되돌리는 것입니다

수동으로 두 모드 간에 변경하려면 resume(), pause() 메도드를 사용하면 됩니다.

pipe 메소드로 읽기 가능한 스트림을 사용할 때는 두 모드를 신경쓰지 않아도 됩니다. pipe 가 자동으로 관리하기 때문이죠.

## 스트림 구현하기

두 가지 다른 태스트
- 스트림을 구현하는 작업
- 스트림을 사용하는 작업

### Writable 
- eg) stdin > console.log

```js

const { Writable } = require("stream")

const outStream = new Writable({
  write(chunk, encodeing, callback) {
    // chunk는 보통 버퍼
    console.log(chunk.toString())
    callback() // 쓰기를 성공, 실패를 알리려면 에러 객체와 함께 콜백을 호출
  },
})

process.stdin.pipe(outStream) // 
```

### Readable 요청이 있을 때 (on demand) push 

```js
const inStream = new Readable({
  read(size) {
      // 데이터 요구가 있고... 누군가 이것을 읽고자 함
      // push는 큐에 작업물을 넣는다고 생각하면 된다.
    this.push(String.fromCharCode(this.currentCharCode++))
    // 계속 read를 호출하고, 언젠가는 멈춰야 한다.
    if (this.currentCharCode > 90) {
      this.push(null)
    }
  },
})

inStream.currentCharCode = 65
inStream.pipe(process.stdout)
```

### Duplex 스트림 만들기

```js
const { Duplex } = require("stream")

const inoutStream = new Duplex({
  write(chunk, encoding, callback) {
    console.log(chunk.toString())
    callback()
  },

  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++))

    if (this.currentCharCode > 90) {
      this.push(null)
    }
  },
})

inoutStream.currentCharCode = 65
process.stdin.pipe(inoutStream).pipe(process.stdout)

```

- 듀플렉스 스트림의 읽기/쓰기 가능한 면이 다른 것으로부터 완전히 독립적으로 동작한다는 것을 이해하는 것이 중요합니다. 
- 이것 두 개 기능을 하나의 객체로 그룹핑한 것일 뿐입니다.



### Transform 스트림 만들기

- 트랜스폼 스트림은 듀플렉스 스트림보다 더 재밌는데 입력으로부터 출력이 계산되기 때문입니다.


```js
const { Transform } = require("stream")

const upperCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    // read > chunk를 대문자로 변경 > push(write)
    this.push(chunk.toString().toUpperCase())
    callback()
  },
})

process.stdin.pipe(upperCaseTr).pipe(process.stdout)
```

## 스트림 오브젝트 모드

기본적으로 스트림은 버퍼(Buffer)와 문자열(String) 값을 기대합니다. 
- objectMode 플래그가 있는데 자바스크립트 오브젝트를 허용하기 위해 사용할 수 있습니다.

```js
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

```
## 빌트인 트랜스폼 스트림

노드는 매우 쓸만한 빌트인 트랜스폼 스트림을 가지고 있습니다. 이름하야 zip과 crypto 스트림이죠  


### eg) read file > zip > write file

```js
const fs = require("js")
const zlib = require("zlib")
const file = procdss.argv[2]

fs.createReadString(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteString(file + ".gz"))
```

### eg) read file > zip > progressBar > write file


```js
const fs = require("fs")
const zlib = require("zlib")
const file = process.argv[2]

const { Transform } = require("stream")

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write(".")
    callback(null, chunk) // . 데이터를 푸시하는 것과 같습니다.
  },
})

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + ".zz"))
  .on("finish", () => console.log("Done"))
```

### eg) read file > zip > passward > progressBar > write file


```js
// 압축+암호화
fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(crypto.createCipher("aes192", "a_secret"))
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file + ".zz"))
  .on("finish", () => console.log("Done"))


// 압축헤제 = 조립의 반대
fs.createReadStream(file)
  .pipe(crypto.createDecipher('aes192', 'a_secret'))
  .pipe(zlib.createGunzip())
  .pipe(reportProgress)
  .pipe(fs.createWriteStream(file.slice(0, -3))
  .on('finish', () => console.log('Done'));
```

---

# Fetching Millions of Rows with Streams in Node.js

https://dev.to/_patrickgod/fetching-millions-of-rows-with-streams-in-node-js-487e

## eg) pipeline - SQL > pipe...

```
var Readable = stream.Readable;
var i = 1;
var s = new Readable({
    async read(size) {
        const result = await sequelize.query(
            sql + ` LIMIT 1000000 OFFSET ${(i - 1) * 1000000}`, { type: sequelize.QueryTypes.SELECT });
        this.push(JSON.stringify(result));
        i++;
        if (i === 5) {
            this.push(null);
        }
    }
});
s.pipe(res);
```
# ref

NodeJs에서 streaming을 활용한 대용량 엑셀 생성하기
- https://kyungyeon.dev/posts/69

Understanding Streams in Node.js
- https://nodesource.com/blog/understanding-streams-in-nodejs/

Node.js Stream - 높은 퍼포먼스의 Node.js 애플리케이션 만들기
- https://the-amy.tistory.com/8

MongoDB, Node.js 및 Streams로 대량 데이터 작업!
- https://medium.com/nerd-for-tech/transform-export-bulk-database-response-without-memory-overflow-using-mongodb-node-js-streams-bcbb3415dd9c

Streaming SQL in Node.js
- https://itnext.io/streaming-sql-in-node-js-eb419c5bd27e

Nodejs Mysql 과 Stream
- https://steemit.com/kr-dev/@ethanhur/nodejs-mysql-stream

Node.js v19.9.0 documentation
- https://nodejs.org/api/stream.html#streams-promises-api

How to Process Large Files with Node.js
- https://stateful.com/blog/process-large-files-nodejs-streams

Node.js Stream 개념을 익혀보자
- https://elvanov.com/2670

node.js로 스트리밍 서버 구축하기
- https://madchick.tistory.com/169