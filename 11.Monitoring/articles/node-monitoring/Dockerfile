FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
RUN npm install 

COPY src /app/src
EXPOSE 5050

CMD ["npm","run","start"]