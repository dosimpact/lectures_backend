
Redis Cluster 구성하기
1번 방법으로 시도 했으나, 도커 외부에 들어올때 문제가 발생하여 2번 방법으로 네트워크를 구성함
- 1번방법 : bridge 네트워크로, 도커 내부 네트워크만 구성이 되어, 레디스 리다이렉트가 정상적으로 동작하지 않음.
- 2번방법 : host와 유사한?방식의 네트워크 구성이지만, 하나의 서비스가 네트워크 통로역할을 하며 구성되는 방식이다.

1. https://box0830.tistory.com/404
2. https://velog.io/@ililil9482/Redis-Cluster-%EA%B5%AC%EC%84%B1

---

- [docker network](#docker-network)
  - [docker network 필요성](#docker-network-필요성)
  - [docker network ls](#docker-network-ls)
  - [네트워크 종류](#네트워크-종류)
  - [네트워크 생성 및 붙이기](#네트워크-생성-및-붙이기)
  - [동일네트워크내 통신하기](#동일네트워크내-통신하기)
  - [네트워크 삭제](#네트워크-삭제)
- [docker compose network](#docker-compose-network)
  - [디폴트 네워크로 구성하여 연결](#디폴트-네워크로-구성하여-연결)
  - [컨테이너간 통신](#컨테이너간-통신)
  - [커스텀 네트워크 추가](#커스텀-네트워크-추가)
  - [외부 네트워크 사용](#외부-네트워크-사용)

# docker network
https://www.daleseo.com/docker-networks/

## docker network 필요성

- 격리된 환경에서 돌아가는 컨테이너는 서로 통신이 불가능함.
- 하나의 네트워크를 구성해주면 통신이 가능해진다. 

목표:
- 컨테이너간의 네트워크 만들기
- 컨테이커밖의 네트워크 구성하기

## docker network ls

```
docker network ls

NETWORK ID     NAME                          DRIVER    SCOPE
// 도커 데몬이 기본적으로 만들어준 네트워크
c6294af5fba5   bridge                        bridge    local
d932bfb7a1ca   host                          host      local
255c07dcf247   none                          null      local
// 사용자가 직접 생성한 네트워크
7f35e3df4c13   redis-cluster_redis_cluster   bridge    local
4fc4dc3e1e71   montetalks-workers_default    bridge    local
```
## 네트워크 종류

bridge  네트워크는 하나의 호스트 컴퓨터 내에서 여러 컨테이너들이 서로 소통할 수 있도록 해줍니다.  
host    네트워크는 컨터이너를 호스트 컴퓨터와 동일한 네트워크에서 컨테이너를 돌리기 위해서 사용됩니다.  
overlay 네트워크는 여러 호스트에 분산되어 돌아가는 컨테이너들 간에 네트워킹을 위해서 사용됩니다. 

## 네트워크 생성 및 붙이기

```
// birdge network 만들기
docker network create our-net

// network 목록 보기
docker network ls
NETWORK ID     NAME                          DRIVER    SCOPE
f1af1ed3b8a0   our-net                       bridge    local

// 연결된 container 보기
docker network inspect our-net
// 예) 컨테이너가 있는 예
docker network inspect redis-cluster_redis_cluster
[
    {
        "Name": "redis-cluster_redis_cluster",
        "Id": "7f35e3df4c13ea6bb0c6200254f3acaa6e5e3c8dc8b246953f41cb9268d962aa",
        "Created": "2022-12-28T09:02:38.7323616Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "173.17.0.0/24"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "27e8024e415fdb16efe14b85946eacd93ab4273296533e77162c72d9df58e4ac": {
                "Name": "redis02",
                "EndpointID": "c9cc75a669dedd8c98888a6c99d16c45b6d05ff439eed276e92ead8e589efded",
                "MacAddress": "02:42:ad:11:00:03",
                "IPv4Address": "173.17.0.3/24",
                "IPv6Address": ""
            },
            "53e5a4db96f846d04a7cd523f3d070cfd0a5fd0cff6e3439a344c5400001a2b4": {
                "Name": "redis06",
                "EndpointID": "44c654ca2b55aebdb7d21d1a46abf33a1ce3d4c2ce9147ee1b2f54bfc4ff0d3e",
                "MacAddress": "02:42:ad:11:00:07",
                "IPv4Address": "173.17.0.7/24",
                "IPv6Address": ""
            },
            "569f5b9d9e804c6f1019cfdb8b32008acc92b63bbefe9ed557e04719c6d76c7f": {
                "Name": "redis01",
                "EndpointID": "d36e1cecd55d0c46c5396f6731ac26e636c7d517c019c4a8c1aa32a26ea0de71",
                "MacAddress": "02:42:ad:11:00:02",
                "IPv4Address": "173.17.0.2/24",
                "IPv6Address": ""
            },
            "58e921b5f32f4c87e042c535f8bef82265e59dbb0f827041aabdd82ba4fa89f3": {
                "Name": "redis03",
                "EndpointID": "a06d29800440951c712de6b99e624c5a6b324e8da99fb7fd0181af78293f49a6",
                "MacAddress": "02:42:ad:11:00:04",
                "IPv4Address": "173.17.0.4/24",
                "IPv6Address": ""
            },
            "bd60918064e28bd5c084c231006bed0f28e9b6930d46dc0208d9d36cd32deb07": {
                "Name": "redis04",
                "EndpointID": "4c6960196cdcf29ad57a3662f25fd7e484d49ea34e3b3271590155e7d14974bf",
                "MacAddress": "02:42:ad:11:00:05",
                "IPv4Address": "173.17.0.5/24",
                "IPv6Address": ""
            },
            "ed962981e0e15cfa7e8f536eb80f8b2360aad321b9a1e4f939c6ed9595b23997": {
                "Name": "redis05",
                "EndpointID": "429d3c3b02f88706340943d6633adb536b553ee3d7417f354bbccae27124529d",
                "MacAddress": "02:42:ad:11:00:06",
                "IPv4Address": "173.17.0.6/24",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {
            "com.docker.compose.network": "redis_cluster",
            "com.docker.compose.project": "redis-cluster",
            "com.docker.compose.version": "2.2.1"
        }
    }
]
```

```
// 기본적으로 만들어진 bridge 네트워크에 붙게된다. 
docker run -itd --name one busybox
// 우리가 만든 네트워크에 붙여보자.
docker network connect our-net one
// 기존 네트워크에서 연결 해제
docker network disconnect bridge one

// 컨테이너 생성과 동시에, 네트워크 붙이기
docker run -itd --name two --network our-net busybox

```

## 동일네트워크내 통신하기

```
// 컨테이너 이름을 통해 핑
docker exec one ping two
// ip 주소를 통해 핑
docker exec two ping 172.20.0.2

```
## 네트워크 삭제
```
// 삭제할 네트워크를 사용중인 컨테인가 있으므로, 삭제 오류
docker network rm our-net

docker stop one two
docker network rm our-net
docker network prune

```

# docker compose network
https://www.daleseo.com/docker-compose-networks/

## 디폴트 네워크로 구성하여 연결

```
docker network ls

NETWORK ID     NAME                          DRIVER    SCOPE
c6294af5fba5   bridge                        bridge    local
d932bfb7a1ca   host                          host      local
4fc4dc3e1e71   montetalks-workers_default    bridge    local

[montetalks-workers]_default
디렉터리 이름이 montetalks-workers 안에 있는 docker-compose.yml 을 실행시켜 만든 디폴트 네트워크

도커 컴포스 시작 : 네트워크 구성 > 컨테이너 생성
도커 컴포스 다운 : 마지막에 네트워크 삭제

```

## 컨테이너간 통신

```
서비스 이름이 호스트 명으로 사용된다.
docker-compose exec web ping db
---
접속하는 위치가 디폴트 네트워크 내부냐 외부냐에 따라서 포트(port)가 달라질 수 있다는 것

services:
  web:
    build: .
    ports:
      - "8001:8000"

case1 ) 호스트 컴퓨터에서 web 서비스 컨테이너 접속
$ curl -I localhost:8001

case2 ) 같은 네트워크 내의 다른 컨테이너에서 web 서비스 컨테이너 접속
$ docker-compose exec alpine curl -I web:8000


```

## 커스텀 네트워크 추가

```
services:
  web:
    build: .
    ports:
      - "8000:8000"
    networks:
      - default
      - our_net

  db:
    image: postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres

networks:
  our_net:
    driver: bridge

1. our_net 이라는 네트워크 생성
2. service:web 은 default + our_net 모두 연결
3. db는 default 연결

--- 2개 네트워크 생성 확인

docker-compose up -d
Creating network "our_app_default" with the default driver
Creating network "our_app_our_net" with driver "bridge"
Creating our_app_db_1 ... done
Creating our_app_web_1 ... done

--- 2개 네트워크 생성 확인
$ our_app docker network ls
NETWORK ID          NAME                   DRIVER              SCOPE
f1859120a0c3        bridge                 bridge              local
95b00551745b        host                   host                local
1f7202baa40a        none                   null                local
2682634e6535        our_app_default        bridge              local
525403b38bbe        our_app_our_net        bridge              local

```

## 외부 네트워크 사용
- 외부 네트워크를 잘 활용하면 서로 다른 Docker Compose에서 돌아가고 있는 컨테이너 간에도 연결도 가능하게

```
-- 미리 외부 네트워크 생성해둔다.
$ docker network create our_net
6d791b927c8c151c45a10ac13c62f3571ecf38a90756fd2ca1c62b7d3de804e8

$ docker network ls
NETWORK ID          NAME                   DRIVER              SCOPE
f1859120a0c3        bridge                 bridge              local
95b00551745b        host                   host                local
1f7202baa40a        none                   null                local
6d791b927c8c        our_net                bridge              local

--- 외부 네트워크 디폴트로 연결
networks:
  default:
    external:
      name: our_net

```