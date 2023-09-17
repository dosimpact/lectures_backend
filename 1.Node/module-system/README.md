
- [ref](#ref)
- [개요](#개요)
- [CommonsJS, ES Modules 에 대해서](#commonsjs-es-modules-에-대해서)
  - [CommonJS 방식](#commonjs-방식)
  - [EMS](#ems)
- [ESM 삽질기](#esm-삽질기)
  - [CommonJS의 가장 큰 문제](#commonjs의-가장-큰-문제)
  - [JavaScript에서 PureEMS 모듈 문제 해결](#javascript에서-pureems-모듈-문제-해결)
    - [해결 - dynamic import 사용](#해결---dynamic-import-사용)
    - [해결 - .mjs 확장자 사용](#해결---mjs-확장자-사용)
    - [해결 - 전체 프로젝트를 ESM으로 전환](#해결---전체-프로젝트를-esm으로-전환)
  - [Typescript에서 PureEMS 모듈 문제 해결](#typescript에서-pureems-모듈-문제-해결)
    - [해결 - dynamic import 사용](#해결---dynamic-import-사용-1)
    - [미해결 - .mts 확장자 사용](#미해결---mts-확장자-사용)
    - [해결 - 전체 프로젝트를 ESM으로 전환](#해결---전체-프로젝트를-esm으로-전환-1)

# ref

JS/Module CommonJS와 ES Modules는 무엇일까 : https://mong-blog.tistory.com/entry/JSModule-CommonJS%EC%99%80-ES-Modules%EB%8A%94-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C
ESM 삽질기 : https://devblog.kakaostyle.com/ko/2022-04-09-1-esm-problem/
CommonJS와 ESM에 모두 대응하는 라이브러리 개발하기: exports field : https://toss.tech/article/commonjs-esm-exports-field


# 개요 

- javascript 생태계안에서 두 가지 모듈 방식(CommonJS Module, ES Module) 이 공존한다. (ESM 방식으로 전환되는 추세)
- ESM 방식에서는 CommonJS + EMS 모두 가능
- CommonJS 방식에서는 CommonJS + EMS(X) 불가능 (EMS에서 두 모듈 방식을 제공하도록 만들어야한다. 하지만 pure ESM = EMS 모듈방식만 제공하는 라이브러리가 문제)
- * CommonJS 에서 dynamic import를 제공해서 EMS모듈을 불러오도록 한다.


- CommonJS(require), ESM(import) 방식을 cjs, mjs 라고 모듈 방식을 확장자로 명시할 수 있다.
- 두 모듈 방식에 대응하는 라이브러리 개발이 필요.

# CommonsJS, ES Modules 에 대해서

JS 모듈을 내보내거나 가져올 때 2가지 방식을 사용한다.
- 첫번째 방법은 module.exports로 모듈을 내보내고 require()로 접근하는 CJS(CommonJS),
- 두번째 방법은 export로 모듈을 내보내고 import로 접근하는 ESM(ES Modules)이 있다.

```js
// CJS 방법
module.exports = { ... }        // 모듈 내보낼 때
const utils = require('utils'); // 모듈 가져올 때   
---
// ESM 방법
export.default =()=> { ... }; // 모듈 내보낼 때

import utils from 'utils';    // 모듈 가져올 때  
```

## CommonJS 방식

- NodeJS에서 지원하는 모듈 방식으로, 초기 Node버전부터 사용되었다.
- 별도의 설정이 없다면 CJS가 기본값이다.
- require() 모듈을 동적으로 불러오고, 즉시 스크립트를 실행하는 구조이다.
- import 순서에 따라 스크립트를 실행한다.
- top-level await가 불가능하므로 동기적으로 작동한다.
- 동기로 작동하므로 promise를 리턴하지 않고, module.exports에 설정된 값만을 리턴한다.
- 순환참조가 발생되면, 나중에 불러오는 require는 무시된다.

```js
const utils = require('utils');  // utils 모듈에 접근하기

module.exports.utils = { ... };  // named exports
module.exports = { ... }         // default exports

// calculator.js
module.exports.add = (a, b) => a + b;
module.exports.sub = (a, b) => a - b;

// app.js
const calculator = require("./calculator.js");  
const { add } = require("./calculator.js");    

console.log(calculator.add(2, 2)); // 출력: 4
console.log(add(2, 2));            // 출력: 4

// calculator2.js
module.exports = (x, y) => x + y

// app2.js
const add = require("./calculator2.js"); // 모듈을 add로 명명하기
console.log(add(2, 2));                 // 출력: 4

```
## EMS

- ES Modules(MJS)는 ECMAScript에서 지원하는 방식이다.
- Node14에선 CJS, MJS이 공존하는데, 두 개를 동시에 사용하기 위해 별도의 처리가 필요하다.
- 모듈 시스템을 CJS(기본값)에서 ESM으로 변경할 시, JS 일부 동작이 변경된다. (호환성 문제)
- top-level await를 지원하므로 module loader가 비동기 환경에서 실행된다.
- 그러므로 CJS처럼 스크립트를 바로 실행하지 않고 import, export구문을 찾아 스크립트를 파싱한다.
- 파싱 단계에서 import, export 에러를 감지할 수 있다.
- 모듈을 병렬로 다운로드하지만, 실행은 순차적으로 한다.
- import와 export를 지원하지 않는 브라우저가 있기에, ESM 사용을 위해 번들러가 필요하다.


```js
ESM 방식을 사용하기 위해선 package.json에 “type”: “module”을 설정해야 한다.
// package.json
{
  "type": "module",
}

// 모듈에 접근하기 위해서 import을 사용한다.
import utils from 'utils';
import { add } from 'utils';
import { add as add_func } from "utils";

// calculator.js
export const  = (x, y) => x + y;

// app.js
import { sum } from "./calculator.js";
import { sum as sum_func } from "./calculator.js";  // 다른 별칭으로 수정
console.log(sum(2, 4));      // 출력: 6
console.log(sum_func(2, 4)); // 출력: 6

// calculator2.js
export default (x, y) => x + y;
// app2.js
import calculator from "./calculator.js";
console.log(calculator.sum(2, 4));  // error

```



# ESM 삽질기

## CommonJS의 가장 큰 문제

순환 참조가 발생하는 경우(require('./a')) 모듈을 다시 읽지는 않습니다.

```js
// a.js
console.log('a1');
console.log(require('./b').b);
console.log('a2');
exports.a = 1;

// b.js
console.log('b1');
console.log(require('./a').a); // undefined
console.log('b2');
exports.b = 2;

$ node a.js 
a1
b1
undefined
b2
2
a2
```

- TypeScript의 import문은 사실 require로 변환되는 코드이다.

```js
// a.ts
console.log('a1');
import { b } from './b';
console.log(b);
console.log('a2');
export const a = 1;

// b.ts
console.log('b1');
import { a } from './a';
console.log(a);
console.log('b2');
export const b = 2;
```

- async/await 문법이 나온 이후에 가장 아쉬운 점 중 하나가 최상위 단계에서 await가 불가능하다는 것입니다.
- 이것은 CommonJS의 한계로 인한 것이고 ESM에서는 가능해졌습니다. 
- CommonJS에서 ESM 모듈을 require 하는 것이 불가능합니다. 
- 반대로 ESM 모듈에서 CommonJS 모듈을 읽는 것은 가능하지만 신경써야 할 것들이 있습니다.
- Pure ESM은 모듈이 CommonJS/ESM 양쪽을 지원하도록 구성할 수도 있지만, 굳이 ESM만 제공한다는 뜻입니다.
- 따라서 프로젝트가 ESM으로 전환해야지만 Pure ESM 모듈을 사용할 수 있습니다.


## JavaScript에서 PureEMS 모듈 문제 해결

TypeScript에서 require로 문법이 변환되어, PureESM 모듈을 불러올 수 없다는 애러가 발생한다.

```js
// a.ts
import chalk from 'chalk';
console.log(chalk.yellow('Hello'));
---
$ ts-node a.ts 
Error [ERR_REQUIRE_ESM]: require() of ES Module /a/node_modules/chalk/source/index.js from /a/a.ts not supported.
Instead change the require of index.js in /a/a.ts to a dynamic import() which is available in all CommonJS modules
---
// 컴파일된 JavaScript 결과물을 보면 원인을 알 수 있다.
"use strict";
exports.__esModule = true;
var chalk_1 = require("chalk");
console.log(chalk_1["default"].yellow('Hello'));
```

### 해결 - dynamic import 사용

```js
// a.js 
(async () => {
  const chalk = await import('chalk');
  console.log(chalk.default.yellow('Hello'));
})();
---
$ node a.js 
Hello
```

### 해결 - .mjs 확장자 사용

```
// a.js 
import chalk from 'chalk';
console.log(chalk.yellow('Hello'));
---
$ node a.js
(node:72179) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
/a/a.js:1
import chalk from 'chalk';
^^^^^^
SyntaxError: Cannot use import statement outside a module
---
$ node a.mjs 
Hello
```

### 해결 - 전체 프로젝트를 ESM으로 전환

-  package.json에 "type": "module"을 추가

```js
//  a.js 
import chalk from 'chalk';
console.log(chalk.yellow('Hello'));
---
// package.json 
{
  "type": "module",
  "dependencies": {
    "chalk": "^5.0.1"
  }
}
---
$ node a.js 
Hello
```



## Typescript에서 PureEMS 모듈 문제 해결

complier설정에서 2가지로 결정된다.
- 1. import -> require 변환 ( dynamic import 사용 불가능, 따라서 ESM 사용 불가능 )
- 2. import -> import 유지 ( dynamic import 사용 가능, static import -> require 변환이 안되는 이슈 )

---

CommonJS 프로젝트에서 원하는 변환 
- 1. require > require 변환
- 2. static import > require 변환
- 3. dynamic import > import 유지  

--- 

commonJS에서 require + dynamic import를 사용 했었는데, ts컴파일러는 이를 변환시키기 때문이다.
TypeScript가 변환하지 않도록 import 문을 감추는 것이 필요
- new Function('specifier', 'return import(specifier)')
- eval로 가능
- tsimportlib 라이브러리 사용


### 해결 - dynamic import 사용

dynamic import 구문을 사용해도 여전히 실행이 안 됩니다. 
컴파일된 결과물을 보면 여전히 require로 변환이 됩니다. 
이를 해결하려면 모듈시스템을 ES 것을 사용한다고 선언해야 합니다. tsconfig에서 module 설정을 적절히 해줘야 합니다.

```js
//a.ts 
(async () => {
  const chalk = await import('chalk');
  console.log(chalk.default.yellow('Hello'));
})();
---
//tsconfig.json 
{
  "compilerOptions": {
    "target": "es2017",
    "module": "es2020", // import를 require로 변환하지 않고 그대로 두는 건 module 설정
    "moduleResolution": "node"
  }
}
---
$ ts-node a.ts 
Hello
```

### 미해결 - .mts 확장자 사용

- .mts 란 확장자도 인식하고, tsc로 컴파일 해보면 .mjs로 나오긴 하지만 적절한 변환은 안 됩니다.

### 해결 - 전체 프로젝트를 ESM으로 전환

import를 require로 변환하지 않고 그대로 두는 건 module 설정이지만, Node.js에서 import 구문을 이해하는 것을 별개입니다. 
- package.json에 "type": "module" 도 추가하면 일반 import 구문도 동작합니다. 
- ts-node로 실행시에는 --esm 옵션을 줘야 동작합니다.

```
// a.ts 
import chalk from 'chalk';
console.log(chalk.yellow('Hello'));

// package.json 
{
  "type": "module",
  "dependencies": {...}
}

$ ts-node --esm a
Hello

$ tsc --module es2020 
$ cat a.js
import chalk from 'chalk';
console.log(chalk.yellow('Hello'));
```