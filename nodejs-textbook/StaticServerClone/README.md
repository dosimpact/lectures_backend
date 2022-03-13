## install & start

```
npm i 
npm run start:dev
```

## configure 

```
// eslint
yarn add -D eslint
npx eslint --init

// prettier
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier

// dotenv
yarn add dotenv cross-env

// nodemon
yarn add nodemon
     "start:dev": "cross-env NODE_ENV=development nodemon --exec babel-node src/app.js",
        croess-env 변수 하에 nodemon이 실행 ( parent-child process? 개념인가)
            그래고 nodemon이 실행하는 프로세스는 babel-node 이다. 
                balel-node는 스크립트는 app.js를 트랜스파일링 후  런타임에 돌리는 node 프로세스이다.

// express
yarn add express cors body-parser cookie-parser morgan helmet
yarn add multer
```


## IssueLog

### express root error handling - Fail

- 서버 요청시 - 비동기 함수 호출을 await 하지 않고, 클라 요청이 끝나고 나중에 비동기 처리에서 오류가 나온 경우


### frontend filedownload 

- 필수 기능 : image serve, file download
- a 태그에 download 붙여도 , dialog를 통한 다운로드가 안되는 경우 있다. 
- 서버측에서 header 를 설정 -> https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js 
- blob concept