/*
path.sep
    윈도우에서는 ₩₩ 로 경로구분, 리눅스는 / 
path.delimiter: :
    윈도우에서는 ; , 리눅스는 : 
------------------------------
__filename:  /home/ubuntu/workspace/lectures/lectures_node/nodejs-textbook/originalSource/ch3/3.5/path.js
path.dirname(): /home/ubuntu/workspace/lectures/lectures_node/nodejs-textbook/originalSource/ch3/3.5
    디렉터리만 가져오기
path.extname(): .js
    파일의 포멧은?
path.basename(): path.js
    파일의 이름은?
path.basename - extname: path
    파일의 정확한 이름은?
------------------------------
path.parse() {
  root: '/',
  dir: '/home/ubuntu/workspace/lectures/lectures_node/nodejs-textbook/originalSource/ch3/3.5',
  base: 'path.js',
  ext: '.js',
  name: 'path'
}
    경로를 파싱해서, 위 구성 요소로(객체로) 리턴해줘
path.format(): C:\users\zerocho/path.js
    parse된 내용을 다시 합쳐
path.normalize(): C:/users\\zerocho\path.js
    경로에서 잘못된 부분분을 고쳐줌.  
------------------------------
path.isAbsolute(C:\): false
    상대경로냐?
path.isAbsolute(./home): false
------------------------------
path.relative(): ../C:\
    경로 두개를 인자로 넣어서, 상대 경로를 구함
path.join(): /home/ubuntu/workspace/lectures/lectures_node/nodejs-textbook/originalSource/users/zerocho
    (중요) 조각난 경로들을 합친다.
path.resolve(): /zerocho 
    (중요) 조각난 경로들을 합친다.(단 이때, 절대경로를 고려함 - 애써 만든 경로가 절대경로로 바뀔 수 있음. )
    eg) path.join(__dirname,"/tmp")   ->  현재 경로에 /tmp 경로를 더함
        하지만 resolve 는 루트경로의 /tmp  -> 로 변경 

*/
const path = require("path");

console.log("path.sep:", path.sep);
console.log("path.delimiter:", path.delimiter);
console.log("------------------------------");
console.log("__filename: ", __filename);
console.log("path.dirname():", path.dirname(__filename));
console.log("path.extname():", path.extname(__filename));
console.log("path.basename():", path.basename(__filename));
console.log(
  "path.basename - extname:",
  path.basename(__filename, path.extname(__filename))
);
console.log("------------------------------");
console.log("path.parse()", path.parse(__filename));
console.log(
  "path.format():",
  path.format({
    dir: "C:\\users\\zerocho",
    name: "path",
    ext: ".js",
  })
);
console.log(
  "path.normalize():",
  path.normalize("C://users\\\\zerocho\\path.js")
);
console.log("------------------------------");
console.log("path.isAbsolute(C:\\):", path.isAbsolute("C:\\"));
console.log("path.isAbsolute(./home):", path.isAbsolute("./home"));
console.log("------------------------------");
console.log(
  "path.relative():",
  path.relative("C:\\users\\zerocho\\path.js", "C:\\")
);
console.log(
  "path.join():",
  path.join(__dirname, "..", "..", "/users", ".", "/zerocho")
);
console.log(
  "path.resolve():",
  path.resolve(__dirname, "..", "users", ".", "/zerocho")
);
