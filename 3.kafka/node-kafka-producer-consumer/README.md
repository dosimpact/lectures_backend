# node-kafka-producer-consumer

Created for [this YouTube tutorial](https://www.youtube.com/watch?v=EiDLKECLcZw).

A kafka producer/consumer proof of concept using node.

![Screen Shot 2021-04-20 at 09 56 47](https://user-images.githubusercontent.com/17026751/115368228-cbcd0000-a1be-11eb-9d17-6ada1ad5ff98.png)

## Prerequisites

* `node`
* `docker`

## Running locally

* `npm install` - installs npm dependencies.
* `./scripts/start-kafka.sh` - starts kafka inside docker container.
* `./scripts/create-topic.sh` - creates kafka topic.
* `npm run start:producer` - starts producer.
* `npm run start:consumer` - starts consumer.



# 정리

## 실행 

```js

# docker-compose 실행
docker-compose up

# 토픽 및 파티션 생성

docker exec -it kafka /opt/bitnami/kafka/bin/kafka-topics.sh \
--create \
--zookeeper zookeeper:2181 \
--replication-factor 1 \
--partitions 1 \
--topic test


# 컨슈머 프로듀서 실행

npm install 
npm start:producer
npm start:consumer

```

## 내용

```md

#  Kafka Tutorial - Node.js Producer & Consumer

목표 : 카프카 데이터 분산 처리 시스템을 왜 쓰는지 알아보고,
간략하게 hello world 수준에서의 실습을 해보자
(*이 수준에서는 Redis MessageQ 와 매우 비슷했다.)


## 아키텍처 주의
kafka 는 안타깝게도 arm/docker가 없는 상황
-> 그래서 EC2 프리티어를 이용해서 kafka & zookeeper 을 실행

[ 오류 진행 사항 ]
오류 : ARM 아키텍처 실행 실패 - ❌
오류 : AMD 프리티어 EC2 실행 실패  메모리 부족인듯 ..?  - ❌
오류 : AMD  로컬 커뮤터 카프카 런 성공 -> zookeeper 옵션 에서 오류나와 파티션 생성 실패 - ❌
🚀 옵션 살펴보기

Docker images 
https://hub.docker.com/_/zookeeper?tab=description
https://hub.docker.com/r/bitnami/kafka
Github 
https://github.com/kriscfoster/node-kafka-producer-consumer
Youtube
https://www.youtube.com/watch?v=EiDLKECLcZw

```