- [도커 파일 작성법](#도커-파일-작성법)
  - [eg) 1](#eg-1)

# 도커 파일 작성법


```
FROM 이미지
WORKDIR
COPY 파일 복사
RUN 도커 빌드시 명령어
ENV 환경변수, -e 옵션으로 주입가능
ARG 빌드동안 살아있는 환경변수
CMD 
```

## eg) 1

```
FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app.mjs" ]
```