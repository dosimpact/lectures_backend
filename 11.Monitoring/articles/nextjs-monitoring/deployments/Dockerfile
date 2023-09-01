FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

RUN npm install yarn -D

COPY . /app
RUN yarn install 
RUN yarn build

EXPOSE 3000

CMD ["yarn","start"]

# docker build -t next-ssg-blog:1 -f ./deployments/Dockerfile . 
# docker run -it --rm -p 3000:3000 --name next-1 next-ssg-blog:1
# docker run -it --rm -p 3000:3000 --name next-2 next-ssg-blog:1
# docker run -it --rm --network="host" --name next-1 next-ssg-blog:1