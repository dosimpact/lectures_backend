- [](#)


## setting nodejs app  

```
Prometheus client for node.js Actions Status
npm i prom-client
```

```
docker-compose up
docker-compose up --build -d
docker-compose down
docker-compose build
```
```
http://localhost:5050
http://localhost:5050/simulate/coin?times=1000
http://localhost:5050/metrics 

http://localhost:9090/
    container_memory_usage_bytes


http://localhost:3000/
```
---


## set-up

### ref)

https://www.youtube.com/watch?v=L17-EN4HcY0
https://www.youtube.com/watch?v=w-eIAFJV8s4 


### 구조

app (node.js)   --> prometheus
cadvisor        --> prometheus  --> grafana


### docker 명령어

*  docker , docker-compose 사전 설치

```
// 실행
docker-compose up -d --build

    * docker-compose , docker-compose.yml
        up > 컨테이너 만들고
        -d > 백그라운드 
        --build >  node 컨테이너 빌드

// 종료
docker-compose down



```

### 테스트

```

노드 서버 확인
    http://localhost:5050/
        // 로그 남기고
    http://localhost:5050/simulate/coin 
        // 엑스포터 확인
    http://localhost:5050/metrics

프로메테우스 서버 확인
http://localhost:9090/
    조회 해보기
        - tails_count
        - heads_count
        - flip_count

그라파나 페이지 확인
http://localhost:3000/
    대시보드 만들어 보기
        - tails_count
        - heads_count
        - flip_count

```
