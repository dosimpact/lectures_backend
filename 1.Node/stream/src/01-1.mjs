const stdin = process.stdin;

const stdout = process.stdout.on("data", (msg) => {
  console.log("stdout.on data", msg);
});

stdin
  .map((e) => {
    return String(e).toUpperCase();
  })
  .pipe(stdout);

// ? 두번의 터미널 입력 중 한번만 stdout.on('data')가 실행된다.
// - event + pipe 를 같이 사용해서 그렇다.

// 1. 아래처럼 pipe를 하나로만 연결하여 이벤트를 섞지 말자.
// process.stdin.map((e) => String(e).toUpperCase()).pipe(process.stdout);
