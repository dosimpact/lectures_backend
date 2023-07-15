// eg, stdin > stdout 스트림

// 1. 아래처럼 pipe를 하나로만 연결하여 이벤트를 섞지 말자.
process.stdin.map((e) => String(e).toUpperCase()).pipe(process.stdout);
