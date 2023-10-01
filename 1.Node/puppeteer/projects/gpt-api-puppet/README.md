# nodemon onbaording with typescript setting

node index.js
ts-node index.ts

## prepare
- node.js

## install

- create tsconfig.json

```
npm init -y
npm install typescript 
npm install nodemon ts-node -D
npx tsc --init
```

## puppeteer 로직 원칙

### Interval Event

지속적으로 핸들링 해줘야 하는 이벤트
- intervalEvent : Insert page down
- intervalEvent : modal removoal
- internvalEvent : remove button in swiper-slide

### Presetting : Onetime Event 

특정 작업전에 Prepare하는 작업
- onetime Event : selector GTP4

### 자동화 프로그램의 로그를 잘 남겨야 한다.

어떠한 이유로 멈출 수 있을지 모른다.
- 앱의 업데이트
- 특정 행위의 rete limit도달
- ip blocked

try-catch를 잘 이용해서 특정 절차에서 다음 상태로 이동 못했다면, 적절한 상황을 재현할 수 있도록 해야 한다.
- 필수 항목 : 로깅 시간, 현재 상태, 기대 값, 실패 이유 

### 모든 로직은 절차지향 단계를 거친다.

- Retry가 가능하도록 작성
- 현재 status를 지속적으로 추적할 수 있어야 한다.



# remain issue

## Entering prompt text cannot make to Fetching Status

```
[info] typePromptWhenIdleStatus > wait currentStatus === IDLE SUBMIT_READY
Error: [Error][timeout][typePromptWhenIdleStatus] IDLE status is not income
```