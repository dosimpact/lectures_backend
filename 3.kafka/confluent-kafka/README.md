
# 간단한 카프카 환경 구성하기

## ref

간단한 카프카 환경 구성하기

https://devocean.sk.com/search/techBoardDetail.do?ID=163709&query=%EC%B9%B4%ED%94%84%EC%B9%B4&searchData=Kafka&page=&subIndex=&idList=%5B163709%2C+163640%5D

## Install Command 

```
# docker 설치 확인
docker -v

# docker-compose.yml 파일을 다운로드합니다
curl --silent --output docker-compose.yml https://raw.githubusercontent.com/confluentinc/cp-all-in-one/7.0.1-post/cp-all-in-one/docker-compose.yml

# docker-compose 실행 및 확인 
docker-compose up -d
docker-compose ps

# cf)
-   docker-compose ps 는 현재 디렉터리의 docker-compose.yml 의 상태를 보여준다.  
-   docker-compose.yml 가 이동하면,  docker desktop 에서는 오류발생

---

docker-compose stop
[+] Running 9/9
 ⠿ Container ksql-datagen     Stopped 10.1s
 ⠿ Container rest-proxy       Stopped  0.5s
 ⠿ Container control-center   Stopped  0.8s
 ⠿ Container ksqldb-cli       Stopped  0.1s
 ⠿ Container ksqldb-server    Stopped  0.6s
 ⠿ Container connect          Stopped  0.6s
 ⠿ Container schema-registry  Stopped  0.5s
 ⠿ Container broker           Stopped 10.3s
 ⠿ Container zookeeper        Stopped  0.5s

```
---

## exec Command 

```
설치가 완료되었다면, 이제 간단하게 CLI를 이용하여 프로듀서와 컨슈머 동작을 테스트   
    -   카프카 클라이언트 사용을 위해 wget 명령어를 이용해 
    -   아파치 카프카 3.1 버전을 다운로드한 후 tar 명령어를 이용해 압축을 해제합니다. 

❯ wget https://dlcdn.apache.org/kafka/3.1.0/kafka_2.12-3.1.0.tgz

❯ tar zxf kafka_2.12-3.1.0.tgz

압축 해제 완료 후 가장 먼저 실습용 토픽 peter-test01을 생성하겠습니다. 브로커가 하나이므로 파티션 수 1, 리플리케이션 팩터 수 1로 생성합니다. 

❯ kafka_2.12-3.1.0/bin/kafka-topics.sh --bootstrap-server localhost:9092 --topic peter-test01 --partitions 1 --replication-factor 1 --create

Created topic peter-test01.


토픽 생성이 완료되었다면, 먼저 콘솔 컨슈머를 실행합니다. 

❯ kafka_2.12-3.1.0/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic peter-test01


콘솔 컨슈머를 실행해둔 창은 그대로 두고, 새로운 터미털 창을 오픈합니다. 다음으로 콘솔 프로듀서를 이용하여 peter-test01 토픽으로 hello! kafka! 메시지를 전송해보겠습니다. 

❯ kafka_2.12-3.1.0/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic peter-test01
> hello! kafka! 

앞서 콘솔 컨슈머를 실행한 화면으로 이동해보면, 콘솔 프로듀서를 통해 전송한 hello! kafka! 메시지를 가져왔음을 확인할 수 있습니다. 
```


## 컨트롤 센터

도커 이미지는 컨플루언트에서 제공하는 이미지이므로 GUI 형태로 관리할 수 있는 컨트롤 센터도 포함되어 있습니다.  
컨트롤 센터를 이용하고 싶으신 분들은 웹브라우저에서 다음 주소로 접근하시면 컨트롤 센터를 경험해 볼 수 있습니다.   

http://localhost:9021/clusters. 




## Remove Command 

```
도커 환경 중지 및 삭제 
로컬 환경에서 테스트 등이 끝나면, 다음의 명령어를 이용하여 실행했던 컨테이너들을 중지할 수 있습니다.

❯ docker-compose stop

도커를 사용하게 되면, 이미지들을 다운로드하게 되는데, 만약 해당 이미지들을 더 이상 사용하지 않는다고 하면 깔끔하게 삭제하여 디스크 공간을 확보할 필요가 있습니다. 다음 명령어를 실행하면, 다운로드했던 이미지들을 깔끔하게 삭제할 수 있습니다. 

❯ docker system prune -a --volumes --filter "label=io.confluent.docker"

```