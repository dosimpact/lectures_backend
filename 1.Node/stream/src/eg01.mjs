// eg, stdin > stdout 스트림

// 1. event driven
// stdout 스트림에 데이터가 들어왔을때
process.stdout.on("data", (msg) => {
  console.log("stdout stream data : ", msg);
  console.log("stdout stream data(buffer to string) : ", msg.toString("utf-8"));
  return msg;
});

// 2. pipe
process.stdin
  .map((e) => {
    return String(e).toUpperCase();
  })
  .pipe(process.stdout);

// 3.
// ? 두번의 터미널 입력 중 한번만 stdout.on('data')가 실행된다.
// - event + pipe 를 같이 사용해서 그렇다.
