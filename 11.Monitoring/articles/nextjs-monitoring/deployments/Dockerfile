FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
RUN npm install yarn -D
RUN yarn install 

COPY . /app
EXPOSE 3000

CMD ["npm","run","start"]

# docker build -t next-ssg-blog:1 -f ./deployments/Dockerfile . 
# docker run -it --rm -p 3000:3000 next-ssg-blog:1