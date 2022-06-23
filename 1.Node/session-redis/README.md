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

// session
yarn add express-session connect-redis redis
```

