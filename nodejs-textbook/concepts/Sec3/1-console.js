/**
 * console 객체
 *    dir   객체 출력 + 옵션(깊이설정, 컬러설정,...)
 *    time,timeEnd  시간측정
 *    error
 *    trace 콜스택 출력 , error trace 처럼
 *    table 객체 배열을 테이블 형식에 맞추어 출력
 */
const string = "abc";
const number = 1;
const boolean = true;
const obj = {
  outside: {
    inside: {
      key: "value",
    },
  },
};
console.time("전체시간");
console.error("에러 메시지는 console.error에 담아주세요");
console.table([
  { name: "제로", birth: 1994 },
  { name: "hero", birth: 1988 },
]);

console.dir(obj, { colors: true });
console.dir(obj, { colors: false, depth: 1 });

console.time("시간측정");
for (let i = 0; i < 100000; i++) {}
console.timeEnd("시간측정");

function b() {
  console.trace("에러 위치 추적");
}
function a() {
  b();
}
a();

console.timeEnd("전체시간");
