/**
 * setTimeout   ms시간 이후 이벤트 루프로 콜백 보냄
 *    clearTimeout
 *
 * setInterval    일정 ms간격으로 이벤트 루프로 콜백 보냄
 *    clearInterval
 *
 * setImmediate 즉시 이벤트 루프로 보낸다.
 *    clearImmediate
 */
const timeout = setTimeout(() => {
  console.log("1.5초 후 실행");
}, 1500);

const interval = setInterval(() => {
  console.log("1초마다 실행");
}, 1000);

const timeout2 = setTimeout(() => {
  console.log("실행되지 않습니다");
}, 3000);

setTimeout(() => {
  clearTimeout(timeout2);
  clearInterval(interval);
}, 2500);

const immediate = setImmediate(() => {
  console.log("즉시 실행");
});

const immediate2 = setImmediate(() => {
  console.log("실행되지 않습니다");
});

clearImmediate(immediate2);
