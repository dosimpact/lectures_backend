ref : https://box0830.tistory.com/404


---
- [컴퓨터 환경](#컴퓨터-환경)
- [Sentinel](#sentinel)


지난번 포스팅을 통하여 Redis의 정의 및 Sentinel, Cluster의 고가용성을 알아보았는데요. 

이번에는 간단하게 docker-compose를 활용하여 아래 세 가지 방법의 Redis 구성을 진행해보았습니다.

Standalone
Sentinel
Cluster mode
 

간단하게 설정 파일 및 실행 명령어만 작성해두었습니다. 궁금한 점은 댓글로 남겨주시면 최대한 답변 남기도록 하겠습니다.

 

 
What is Redis; Remote Dictionary Server

Airflow의 CeleryExecutor를 사용할 때, Redis가 Queue로써 동작하는 것을 알고 있었지만, 지금까지 이를 제대로 알아보고자 한 적이 없었습니다. 이번 기회에 Redis가 무엇인지, 어떠한 구조로 이루어져 있

box0830.tistory.com
 
Redis High Availability; Sentinel vs Cluster

Overview 지난 포스팅에서 Redis가 무엇인지 가볍게 살펴보는 시간을 가졌었습니다. 이번 포스팅에서는 Redis의 HA 구성을 주제로 Sentinel과 Cluster 두 방식을 비교해보도록 하겠습니다. What is Redis; Remote

box0830.tistory.com
 

# 컴퓨터 환경

m2 apple silicon chip
Docker Version: 20.10.7
Redis version: 7.x.x
 

Standalone
Environment

standalone.yaml

version: '3.7'
services:
  redis:
    image: redis:7.0.4
    command: redis-server --port 6379
    container_name: redis_standalone
    hostname: redis_standalone
    labels:
      - "name=redis"
      - "mode=standalone"
    ports:
      - 6379:6379
 

Run

$ docker-compose -f redis/standalone.yaml up
 

Test

$ docker exec -it redis_standalone redis-cli
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> set story test
OK
127.0.0.1:6379> get story
"test"
127.0.0.1:6379> keys *
1) "story"
 

Sentinel
Environment

편의상 bitnami 이미지를 활용하여 생성해보았습니다.

version: '3.7'
networks:
  sentinel:
    driver: bridge

services:
  redis:
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=master
      - REDIS_PASSWORD=str0ng_passw0rd
    networks:
      - sentinel
    ports:
      - '6379'
  redis-slave:
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - '6379'
    depends_on:
      - redis
    networks:
      - sentinel
  redis-sentinel:
    image: 'bitnami/redis-sentinel:latest'
    environment:
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
    depends_on:
      - redis
      - redis-slave
    ports:
      - '26379-26381'
    networks:
      - sentinel
 

Run

$ docker-compose -f redis/sentinel.yaml up --scale redis-sentinel=3 --scale redis-slave=3
더보기
 

Check

$ docker exec -it redis-redis-sentinel-1 redis-cli -p 26379
127.0.0.1:26379> info sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_tilt_since_seconds:-1
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=172.20.0.2:6379,slaves=3,sentinels=3
 

 

Cluster Mode
Environment

node[01-06].conf

port [7001-7006]
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 3000
appendonly yes
 

cluster.yaml

version: '3.7'
services:
  node01:
    image: redis:7.0.4
    container_name: redis01
    restart: always
    ports:
      - 7001:7001
    volumes:
      - ./cluster/node01.conf:/etc/redis/redis.conf
    command:
      redis-server /etc/redis/redis.conf
    networks:
      redis_cluster:
        ipv4_address: 173.17.0.2

  node02:
    image: redis:7.0.4
    container_name: redis02
    restart: always
    ports:
      - 7002:7002
    volumes:
      - ./cluster/node02.conf:/etc/redis/redis.conf
    command:
      redis-server /etc/redis/redis.conf
    networks:
      redis_cluster:
        ipv4_address: 173.17.0.3

  node03:
    image: redis:7.0.4
    container_name: redis03
    restart: always
    ports:
      - 7003:7003
    volumes:
      - ./cluster/node03.conf:/etc/redis/redis.conf
    command:
      redis-server /etc/redis/redis.conf
    networks:
      redis_cluster:
        ipv4_address: 173.17.0.4

  node04:
    image: redis:7.0.4
    container_name: redis04
    restart: always
    ports:
      - 7004:7004
    volumes:
      - ./cluster/node04.conf:/etc/redis/redis.conf
    command:
      redis-server /etc/redis/redis.conf
    networks:
      redis_cluster:
        ipv4_address: 173.17.0.5

  node05:
    image: redis:7.0.4
    container_name: redis05
    restart: always
    ports:
      - 7005:7005
    volumes:
      - ./cluster/node05.conf:/etc/redis/redis.conf
    command:
      redis-server /etc/redis/redis.conf
    networks:
      redis_cluster:
        ipv4_address: 173.17.0.6

  node06:
    image: redis:7.0.4
    container_name: redis06
    restart: always
    ports:
      - 7006:7006
    volumes:
      - ./cluster/node06.conf:/etc/redis/redis.conf
    command:
      redis-server /etc/redis/redis.conf
    networks:
      redis_cluster:
        ipv4_address: 173.17.0.7

  redis_cluster:
    image: redis:7.0.4
    container_name: redis_cluster
    platform: linux/arm64/v8
    command: redis-cli --cluster create 173.17.0.2:7001 173.17.0.3:7002 173.17.0.4:7003 173.17.0.5:7004 173.17.0.6:7005 173.17.0.7:7006 --cluster-yes --cluster-replicas 1
    depends_on:
      - node01
      - node02
      - node03
      - node04
      - node05
      - node06
    networks:
      redis_cluster:
        ipv4_address: 173.17.0.8
networks:
  redis_cluster:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 173.17.0.0/24
 

 

Run

$ docker-compose -f redis/cluster.yaml up --force-recreate
닫기
[+] Running 8/7
 ⠿ Network redis_redis_cluster  Created                                                                                                                                                                  0.0s
 ⠿ Container redis02            Created                                                                                                                                                                  0.1s
 ⠿ Container redis03            Created                                                                                                                                                                  0.1s
 ⠿ Container redis06            Created                                                                                                                                                                  0.1s
 ⠿ Container redis04            Created                                                                                                                                                                  0.1s
 ⠿ Container redis05            Created                                                                                                                                                                  0.1s
 ⠿ Container redis01            Created                                                                                                                                                                  0.1s
 ⠿ Container redis_cluster      Created                                                                                                                                                                  0.0s
Attaching to redis01, redis02, redis03, redis04, redis05, redis06, redis_cluster
redis01        | 1:C 12 Sep 2022 06:17:39.010 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
redis01        | 1:C 12 Sep 2022 06:17:39.010 # Redis version=7.0.4, bits=64, commit=00000000, modified=0, pid=1, just started
redis01        | 1:C 12 Sep 2022 06:17:39.010 # Configuration loaded
redis01        | 1:M 12 Sep 2022 06:17:39.011 * monotonic clock: POSIX clock_gettime
redis01        | 1:M 12 Sep 2022 06:17:39.011 * No cluster configuration found, I'm f1f993c453b358e7858b4946d0cfbe53df1b0d1c
redis01        | 1:M 12 Sep 2022 06:17:39.012 * Running mode=cluster, port=7001.
redis01        | 1:M 12 Sep 2022 06:17:39.012 # Server initialized
redis01        | 1:M 12 Sep 2022 06:17:39.014 * Creating AOF base file appendonly.aof.1.base.rdb on server start
redis01        | 1:M 12 Sep 2022 06:17:39.016 * Creating AOF incr file appendonly.aof.1.incr.aof on server start
redis01        | 1:M 12 Sep 2022 06:17:39.016 * Ready to accept connections
redis04        | 1:C 12 Sep 2022 06:17:39.160 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
redis04        | 1:C 12 Sep 2022 06:17:39.160 # Redis version=7.0.4, bits=64, commit=00000000, modified=0, pid=1, just started
redis04        | 1:C 12 Sep 2022 06:17:39.160 # Configuration loaded
redis04        | 1:M 12 Sep 2022 06:17:39.160 * monotonic clock: POSIX clock_gettime
redis04        | 1:M 12 Sep 2022 06:17:39.161 * No cluster configuration found, I'm e74049c7d4ac68ead6fbb7d240995adec1dbe443
redis04        | 1:M 12 Sep 2022 06:17:39.164 * Running mode=cluster, port=7004.
redis04        | 1:M 12 Sep 2022 06:17:39.164 # Server initialized
redis04        | 1:M 12 Sep 2022 06:17:39.169 * Creating AOF base file appendonly.aof.1.base.rdb on server start
redis04        | 1:M 12 Sep 2022 06:17:39.171 * Creating AOF incr file appendonly.aof.1.incr.aof on server start
redis04        | 1:M 12 Sep 2022 06:17:39.171 * Ready to accept connections
redis06        | 1:C 12 Sep 2022 06:17:39.202 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
redis06        | 1:C 12 Sep 2022 06:17:39.202 # Redis version=7.0.4, bits=64, commit=00000000, modified=0, pid=1, just started
redis06        | 1:C 12 Sep 2022 06:17:39.202 # Configuration loaded
redis06        | 1:M 12 Sep 2022 06:17:39.202 * monotonic clock: POSIX clock_gettime
redis06        | 1:M 12 Sep 2022 06:17:39.203 * No cluster configuration found, I'm 9e267dec00ae0e623eef7379f1ddd010f46ea57f
redis06        | 1:M 12 Sep 2022 06:17:39.205 * Running mode=cluster, port=7006.
redis06        | 1:M 12 Sep 2022 06:17:39.205 # Server initialized
redis06        | 1:M 12 Sep 2022 06:17:39.212 * Creating AOF base file appendonly.aof.1.base.rdb on server start
redis06        | 1:M 12 Sep 2022 06:17:39.215 * Creating AOF incr file appendonly.aof.1.incr.aof on server start
redis06        | 1:M 12 Sep 2022 06:17:39.215 * Ready to accept connections
redis03        | 1:C 12 Sep 2022 06:17:39.239 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
redis03        | 1:C 12 Sep 2022 06:17:39.239 # Redis version=7.0.4, bits=64, commit=00000000, modified=0, pid=1, just started
redis03        | 1:C 12 Sep 2022 06:17:39.239 # Configuration loaded
redis03        | 1:M 12 Sep 2022 06:17:39.239 * monotonic clock: POSIX clock_gettime
redis03        | 1:M 12 Sep 2022 06:17:39.239 * No cluster configuration found, I'm ea3f1551ab7f945bb714d7f94aa2c3fc7d8dbdd5
redis03        | 1:M 12 Sep 2022 06:17:39.242 * Running mode=cluster, port=7003.
redis03        | 1:M 12 Sep 2022 06:17:39.242 # Server initialized
redis03        | 1:M 12 Sep 2022 06:17:39.245 * Creating AOF base file appendonly.aof.1.base.rdb on server start
redis03        | 1:M 12 Sep 2022 06:17:39.247 * Creating AOF incr file appendonly.aof.1.incr.aof on server start
redis03        | 1:M 12 Sep 2022 06:17:39.247 * Ready to accept connections
redis05        | 1:C 12 Sep 2022 06:17:39.302 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
redis05        | 1:C 12 Sep 2022 06:17:39.302 # Redis version=7.0.4, bits=64, commit=00000000, modified=0, pid=1, just started
redis05        | 1:C 12 Sep 2022 06:17:39.302 # Configuration loaded
redis05        | 1:M 12 Sep 2022 06:17:39.303 * monotonic clock: POSIX clock_gettime
redis05        | 1:M 12 Sep 2022 06:17:39.303 * No cluster configuration found, I'm ca721ac17767523dfdeaeafd93007063f0753170
redis05        | 1:M 12 Sep 2022 06:17:39.306 * Running mode=cluster, port=7005.
redis05        | 1:M 12 Sep 2022 06:17:39.306 # Server initialized
redis05        | 1:M 12 Sep 2022 06:17:39.309 * Creating AOF base file appendonly.aof.1.base.rdb on server start
redis05        | 1:M 12 Sep 2022 06:17:39.312 * Creating AOF incr file appendonly.aof.1.incr.aof on server start
redis05        | 1:M 12 Sep 2022 06:17:39.312 * Ready to accept connections
redis02        | 1:C 12 Sep 2022 06:17:39.339 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
redis02        | 1:C 12 Sep 2022 06:17:39.340 # Redis version=7.0.4, bits=64, commit=00000000, modified=0, pid=1, just started
redis02        | 1:C 12 Sep 2022 06:17:39.340 # Configuration loaded
redis02        | 1:M 12 Sep 2022 06:17:39.341 * monotonic clock: POSIX clock_gettime
redis02        | 1:M 12 Sep 2022 06:17:39.341 * No cluster configuration found, I'm 73b4d636e7c4b0e6d28e01ea1347a503bd15ab50
redis02        | 1:M 12 Sep 2022 06:17:39.342 * Running mode=cluster, port=7002.
redis02        | 1:M 12 Sep 2022 06:17:39.343 # Server initialized
redis02        | 1:M 12 Sep 2022 06:17:39.346 * Creating AOF base file appendonly.aof.1.base.rdb on server start
redis02        | 1:M 12 Sep 2022 06:17:39.349 * Creating AOF incr file appendonly.aof.1.incr.aof on server start
redis02        | 1:M 12 Sep 2022 06:17:39.349 * Ready to accept connections
redis01        | 1:M 12 Sep 2022 06:17:39.506 # configEpoch set to 1 via CLUSTER SET-CONFIG-EPOCH
redis02        | 1:M 12 Sep 2022 06:17:39.507 # configEpoch set to 2 via CLUSTER SET-CONFIG-EPOCH
redis03        | 1:M 12 Sep 2022 06:17:39.507 # configEpoch set to 3 via CLUSTER SET-CONFIG-EPOCH
redis04        | 1:M 12 Sep 2022 06:17:39.508 # configEpoch set to 4 via CLUSTER SET-CONFIG-EPOCH
redis05        | 1:M 12 Sep 2022 06:17:39.509 # configEpoch set to 5 via CLUSTER SET-CONFIG-EPOCH
redis06        | 1:M 12 Sep 2022 06:17:39.509 # configEpoch set to 6 via CLUSTER SET-CONFIG-EPOCH
redis01        | 1:M 12 Sep 2022 06:17:39.513 # IP address for this node updated to 173.17.0.2
redis05        | 1:M 12 Sep 2022 06:17:39.517 # IP address for this node updated to 173.17.0.6
redis02        | 1:M 12 Sep 2022 06:17:39.618 # IP address for this node updated to 173.17.0.3
redis03        | 1:M 12 Sep 2022 06:17:39.618 # IP address for this node updated to 173.17.0.4
redis06        | 1:M 12 Sep 2022 06:17:39.618 # IP address for this node updated to 173.17.0.7
redis04        | 1:M 12 Sep 2022 06:17:39.618 # IP address for this node updated to 173.17.0.5
redis_cluster  | >>> Performing hash slots allocation on 6 nodes...
redis_cluster  | Master[0] -> Slots 0 - 5460
redis_cluster  | Master[1] -> Slots 5461 - 10922
redis_cluster  | Master[2] -> Slots 10923 - 16383
redis_cluster  | Adding replica 173.17.0.6:7005 to 173.17.0.2:7001
redis_cluster  | Adding replica 173.17.0.7:7006 to 173.17.0.3:7002
redis_cluster  | Adding replica 173.17.0.5:7004 to 173.17.0.4:7003
redis_cluster  | M: f1f993c453b358e7858b4946d0cfbe53df1b0d1c 173.17.0.2:7001
redis_cluster  |    slots:[0-5460] (5461 slots) master
redis_cluster  | M: 73b4d636e7c4b0e6d28e01ea1347a503bd15ab50 173.17.0.3:7002
redis_cluster  |    slots:[5461-10922] (5462 slots) master
redis_cluster  | M: ea3f1551ab7f945bb714d7f94aa2c3fc7d8dbdd5 173.17.0.4:7003
redis_cluster  |    slots:[10923-16383] (5461 slots) master
redis_cluster  | S: e74049c7d4ac68ead6fbb7d240995adec1dbe443 173.17.0.5:7004
redis_cluster  |    replicates ea3f1551ab7f945bb714d7f94aa2c3fc7d8dbdd5
redis_cluster  | S: ca721ac17767523dfdeaeafd93007063f0753170 173.17.0.6:7005
redis_cluster  |    replicates f1f993c453b358e7858b4946d0cfbe53df1b0d1c
redis_cluster  | S: 9e267dec00ae0e623eef7379f1ddd010f46ea57f 173.17.0.7:7006
redis_cluster  |    replicates 73b4d636e7c4b0e6d28e01ea1347a503bd15ab50
redis_cluster  | >>> Nodes configuration updated
redis_cluster  | >>> Assign a different config epoch to each node
redis_cluster  | >>> Sending CLUSTER MEET messages to join the cluster
redis_cluster  | Waiting for the cluster to join
redis01        | 1:M 12 Sep 2022 06:17:41.058 # Cluster state changed: ok
redis04        | 1:M 12 Sep 2022 06:17:41.192 # Cluster state changed: ok
redis03        | 1:M 12 Sep 2022 06:17:41.260 # Cluster state changed: ok
redis05        | 1:M 12 Sep 2022 06:17:41.337 # Cluster state changed: ok
redis06        | 1:M 12 Sep 2022 06:17:41.337 # Cluster state changed: ok
redis02        | 1:M 12 Sep 2022 06:17:41.359 # Cluster state changed: ok
redis04        | 1:S 12 Sep 2022 06:17:41.512 * Before turning into a replica, using my own master parameters to synthesize a cached master: I may be able to synchronize with the new master with just a partial transfer.
redis04        | 1:S 12 Sep 2022 06:17:41.512 * Connecting to MASTER 173.17.0.4:7003
redis04        | 1:S 12 Sep 2022 06:17:41.512 * MASTER <-> REPLICA sync started
redis04        | 1:S 12 Sep 2022 06:17:41.512 * Non blocking connect for SYNC fired the event.
redis04        | 1:S 12 Sep 2022 06:17:41.512 * Master replied to PING, replication can continue...
redis05        | 1:S 12 Sep 2022 06:17:41.512 * Before turning into a replica, using my own master parameters to synthesize a cached master: I may be able to synchronize with the new master with just a partial transfer.
redis05        | 1:S 12 Sep 2022 06:17:41.512 * Connecting to MASTER 173.17.0.2:7001
redis03        | 1:M 12 Sep 2022 06:17:41.512 * Replica 173.17.0.5:7004 asks for synchronization
redis03        | 1:M 12 Sep 2022 06:17:41.512 * Partial resynchronization not accepted: Replication ID mismatch (Replica asked for '02cc6c737d5d5254d8ae3ed622243aa84b3acfac', my replication IDs are '6a60e46486a6c49611937bc0ea0700d521ff4cf9' and '0000000000000000000000000000000000000000')
redis03        | 1:M 12 Sep 2022 06:17:41.512 * Replication backlog created, my new replication IDs are 'd6c6da52082ff48324f0756a3d6cd2f8f0e04a39' and '0000000000000000000000000000000000000000'
redis04        | 1:S 12 Sep 2022 06:17:41.512 * Trying a partial resynchronization (request 02cc6c737d5d5254d8ae3ed622243aa84b3acfac:1).
redis03        | 1:M 12 Sep 2022 06:17:41.512 * Delay next BGSAVE for diskless SYNC
redis05        | 1:S 12 Sep 2022 06:17:41.512 * MASTER <-> REPLICA sync started
redis05        | 1:S 12 Sep 2022 06:17:41.513 * Non blocking connect for SYNC fired the event.
redis05        | 1:S 12 Sep 2022 06:17:41.513 * Master replied to PING, replication can continue...
redis01        | 1:M 12 Sep 2022 06:17:41.513 * Replica 173.17.0.6:7005 asks for synchronization
redis01        | 1:M 12 Sep 2022 06:17:41.513 * Partial resynchronization not accepted: Replication ID mismatch (Replica asked for '0697cbecf0f422db4b6d20307c9dc93cfa525f77', my replication IDs are 'fe11beffb46c2c5d41f6243f38159af8a9a03c59' and '0000000000000000000000000000000000000000')
redis01        | 1:M 12 Sep 2022 06:17:41.513 * Replication backlog created, my new replication IDs are '198118915aad9ea51431a4fffc4f88be031ea07e' and '0000000000000000000000000000000000000000'
redis05        | 1:S 12 Sep 2022 06:17:41.513 * Trying a partial resynchronization (request 0697cbecf0f422db4b6d20307c9dc93cfa525f77:1).
redis06        | 1:S 12 Sep 2022 06:17:41.513 * Before turning into a replica, using my own master parameters to synthesize a cached master: I may be able to synchronize with the new master with just a partial transfer.
redis06        | 1:S 12 Sep 2022 06:17:41.513 * Connecting to MASTER 173.17.0.3:7002
redis06        | 1:S 12 Sep 2022 06:17:41.513 * MASTER <-> REPLICA sync started
redis02        | 1:M 12 Sep 2022 06:17:41.513 * Replica 173.17.0.7:7006 asks for synchronization
redis02        | 1:M 12 Sep 2022 06:17:41.513 * Partial resynchronization not accepted: Replication ID mismatch (Replica asked for 'a3676c829270f61d144b4bb4945a3c9ec943238c', my replication IDs are 'f1f39200ada4c086ba889630bfc5ce76934e06e7' and '0000000000000000000000000000000000000000')
redis02        | 1:M 12 Sep 2022 06:17:41.513 * Replication backlog created, my new replication IDs are '6535814a51a8cbea8899f25dbe0f9ca87d4a147a' and '0000000000000000000000000000000000000000'
redis01        | 1:M 12 Sep 2022 06:17:41.513 * Delay next BGSAVE for diskless SYNC
redis06        | 1:S 12 Sep 2022 06:17:41.513 * Non blocking connect for SYNC fired the event.
redis06        | 1:S 12 Sep 2022 06:17:41.513 * Master replied to PING, replication can continue...
redis06        | 1:S 12 Sep 2022 06:17:41.513 * Trying a partial resynchronization (request a3676c829270f61d144b4bb4945a3c9ec943238c:1).
redis02        | 1:M 12 Sep 2022 06:17:41.513 * Delay next BGSAVE for diskless SYNC
redis_cluster  | .
redis_cluster  | >>> Performing Cluster Check (using node 173.17.0.2:7001)
redis_cluster  | M: f1f993c453b358e7858b4946d0cfbe53df1b0d1c 173.17.0.2:7001
redis_cluster  |    slots:[0-5460] (5461 slots) master
redis_cluster  |    1 additional replica(s)
redis_cluster  | M: 73b4d636e7c4b0e6d28e01ea1347a503bd15ab50 173.17.0.3:7002
redis_cluster  |    slots:[5461-10922] (5462 slots) master
redis_cluster  |    1 additional replica(s)
redis_cluster  | S: ca721ac17767523dfdeaeafd93007063f0753170 173.17.0.6:7005
redis_cluster  |    slots: (0 slots) slave
redis_cluster  |    replicates f1f993c453b358e7858b4946d0cfbe53df1b0d1c
redis_cluster  | M: ea3f1551ab7f945bb714d7f94aa2c3fc7d8dbdd5 173.17.0.4:7003
redis_cluster  |    slots:[10923-16383] (5461 slots) master
redis_cluster  |    1 additional replica(s)
redis_cluster  | S: e74049c7d4ac68ead6fbb7d240995adec1dbe443 173.17.0.5:7004
redis_cluster  |    slots: (0 slots) slave
redis_cluster  |    replicates ea3f1551ab7f945bb714d7f94aa2c3fc7d8dbdd5
redis_cluster  | S: 9e267dec00ae0e623eef7379f1ddd010f46ea57f 173.17.0.7:7006
redis_cluster  |    slots: (0 slots) slave
redis_cluster  |    replicates 73b4d636e7c4b0e6d28e01ea1347a503bd15ab50
redis_cluster  | [OK] All nodes agree about slots configuration.
redis_cluster  | >>> Check for open slots...
redis_cluster  | >>> Check slots coverage...
redis_cluster  | [OK] All 16384 slots covered.
redis_cluster exited with code 0
redis05        | 1:S 12 Sep 2022 06:17:46.084 * Full resync from master: 198118915aad9ea51431a4fffc4f88be031ea07e:0
redis01        | 1:M 12 Sep 2022 06:17:46.084 * Starting BGSAVE for SYNC with target: replicas sockets
redis05        | 1:S 12 Sep 2022 06:17:46.088 * MASTER <-> REPLICA sync: receiving streamed RDB from master with EOF to disk
redis05        | 1:S 12 Sep 2022 06:17:46.089 * Discarding previously cached master state.
redis05        | 1:S 12 Sep 2022 06:17:46.089 * MASTER <-> REPLICA sync: Flushing old data
redis05        | 1:S 12 Sep 2022 06:17:46.089 * MASTER <-> REPLICA sync: Loading DB in memory
redis01        | 1:M 12 Sep 2022 06:17:46.085 * Background RDB transfer started by pid 21
redis01        | 21:C 12 Sep 2022 06:17:46.088 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB
redis01        | 1:M 12 Sep 2022 06:17:46.088 # Diskless rdb transfer, done reading from pipe, 1 replicas still up.
redis05        | 1:S 12 Sep 2022 06:17:46.094 * Loading RDB produced by version 7.0.4
redis05        | 1:S 12 Sep 2022 06:17:46.094 * RDB age 0 seconds
redis05        | 1:S 12 Sep 2022 06:17:46.094 * RDB memory usage when created 1.77 Mb
redis05        | 1:S 12 Sep 2022 06:17:46.094 * Done loading RDB, keys loaded: 0, keys expired: 0.
redis05        | 1:S 12 Sep 2022 06:17:46.094 * MASTER <-> REPLICA sync: Finished with success
redis05        | 1:S 12 Sep 2022 06:17:46.094 * Creating AOF incr file temp-appendonly.aof.incr on background rewrite
redis05        | 1:S 12 Sep 2022 06:17:46.095 * Background append only file rewriting started by pid 21
redis01        | 1:M 12 Sep 2022 06:17:46.095 * Background RDB transfer terminated with success
redis01        | 1:M 12 Sep 2022 06:17:46.095 * Streamed RDB transfer with replica 173.17.0.6:7005 succeeded (socket). Waiting for REPLCONF ACK from slave to enable streaming
redis01        | 1:M 12 Sep 2022 06:17:46.095 * Synchronization with replica 173.17.0.6:7005 succeeded
redis05        | 21:C 12 Sep 2022 06:17:46.097 * Successfully created the temporary AOF base file temp-rewriteaof-bg-21.aof
redis05        | 21:C 12 Sep 2022 06:17:46.097 * Fork CoW for AOF rewrite: current 0 MB, peak 0 MB, average 0 MB
redis05        | 1:S 12 Sep 2022 06:17:46.184 * Background AOF rewrite terminated with success
redis05        | 1:S 12 Sep 2022 06:17:46.184 * Successfully renamed the temporary AOF base file temp-rewriteaof-bg-21.aof into appendonly.aof.2.base.rdb
redis05        | 1:S 12 Sep 2022 06:17:46.184 * Successfully renamed the temporary AOF incr file temp-appendonly.aof.incr into appendonly.aof.2.incr.aof
redis05        | 1:S 12 Sep 2022 06:17:46.188 * Removing the history file appendonly.aof.1.incr.aof in the background
redis05        | 1:S 12 Sep 2022 06:17:46.188 * Removing the history file appendonly.aof.1.base.rdb in the background
redis05        | 1:S 12 Sep 2022 06:17:46.191 * Background AOF rewrite finished successfully
redis03        | 1:M 12 Sep 2022 06:17:46.285 * Starting BGSAVE for SYNC with target: replicas sockets
redis04        | 1:S 12 Sep 2022 06:17:46.285 * Full resync from master: d6c6da52082ff48324f0756a3d6cd2f8f0e04a39:0
redis03        | 1:M 12 Sep 2022 06:17:46.285 * Background RDB transfer started by pid 21
redis04        | 1:S 12 Sep 2022 06:17:46.286 * MASTER <-> REPLICA sync: receiving streamed RDB from master with EOF to disk
redis03        | 21:C 12 Sep 2022 06:17:46.286 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB
redis03        | 1:M 12 Sep 2022 06:17:46.286 # Diskless rdb transfer, done reading from pipe, 1 replicas still up.
redis04        | 1:S 12 Sep 2022 06:17:46.287 * Discarding previously cached master state.
redis04        | 1:S 12 Sep 2022 06:17:46.287 * MASTER <-> REPLICA sync: Flushing old data
redis04        | 1:S 12 Sep 2022 06:17:46.287 * MASTER <-> REPLICA sync: Loading DB in memory
redis03        | 1:M 12 Sep 2022 06:17:46.290 * Background RDB transfer terminated with success
redis03        | 1:M 12 Sep 2022 06:17:46.290 * Streamed RDB transfer with replica 173.17.0.5:7004 succeeded (socket). Waiting for REPLCONF ACK from slave to enable streaming
redis03        | 1:M 12 Sep 2022 06:17:46.290 * Synchronization with replica 173.17.0.5:7004 succeeded
redis04        | 1:S 12 Sep 2022 06:17:46.290 * Loading RDB produced by version 7.0.4
redis04        | 1:S 12 Sep 2022 06:17:46.290 * RDB age 0 seconds
redis04        | 1:S 12 Sep 2022 06:17:46.290 * RDB memory usage when created 1.79 Mb
redis04        | 1:S 12 Sep 2022 06:17:46.290 * Done loading RDB, keys loaded: 0, keys expired: 0.
redis04        | 1:S 12 Sep 2022 06:17:46.290 * MASTER <-> REPLICA sync: Finished with success
redis04        | 1:S 12 Sep 2022 06:17:46.290 * Creating AOF incr file temp-appendonly.aof.incr on background rewrite
redis04        | 1:S 12 Sep 2022 06:17:46.290 * Background append only file rewriting started by pid 22
redis04        | 22:C 12 Sep 2022 06:17:46.292 * Successfully created the temporary AOF base file temp-rewriteaof-bg-22.aof
redis04        | 22:C 12 Sep 2022 06:17:46.293 * Fork CoW for AOF rewrite: current 0 MB, peak 0 MB, average 0 MB
redis04        | 1:S 12 Sep 2022 06:17:46.370 * Background AOF rewrite terminated with success
redis04        | 1:S 12 Sep 2022 06:17:46.370 * Successfully renamed the temporary AOF base file temp-rewriteaof-bg-22.aof into appendonly.aof.2.base.rdb
redis04        | 1:S 12 Sep 2022 06:17:46.370 * Successfully renamed the temporary AOF incr file temp-appendonly.aof.incr into appendonly.aof.2.incr.aof
redis04        | 1:S 12 Sep 2022 06:17:46.373 * Removing the history file appendonly.aof.1.incr.aof in the background
redis04        | 1:S 12 Sep 2022 06:17:46.373 * Removing the history file appendonly.aof.1.base.rdb in the background
redis04        | 1:S 12 Sep 2022 06:17:46.375 * Background AOF rewrite finished successfully
redis02        | 1:M 12 Sep 2022 06:17:46.386 * Starting BGSAVE for SYNC with target: replicas sockets
redis06        | 1:S 12 Sep 2022 06:17:46.386 * Full resync from master: 6535814a51a8cbea8899f25dbe0f9ca87d4a147a:0
redis02        | 1:M 12 Sep 2022 06:17:46.386 * Background RDB transfer started by pid 21
redis06        | 1:S 12 Sep 2022 06:17:46.387 * MASTER <-> REPLICA sync: receiving streamed RDB from master with EOF to disk
redis02        | 21:C 12 Sep 2022 06:17:46.387 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB
redis02        | 1:M 12 Sep 2022 06:17:46.387 # Diskless rdb transfer, done reading from pipe, 1 replicas still up.
redis06        | 1:S 12 Sep 2022 06:17:46.387 * Discarding previously cached master state.
redis06        | 1:S 12 Sep 2022 06:17:46.387 * MASTER <-> REPLICA sync: Flushing old data
redis06        | 1:S 12 Sep 2022 06:17:46.388 * MASTER <-> REPLICA sync: Loading DB in memory
redis06        | 1:S 12 Sep 2022 06:17:46.390 * Loading RDB produced by version 7.0.4
redis06        | 1:S 12 Sep 2022 06:17:46.390 * RDB age 0 seconds
redis06        | 1:S 12 Sep 2022 06:17:46.390 * RDB memory usage when created 1.79 Mb
redis06        | 1:S 12 Sep 2022 06:17:46.390 * Done loading RDB, keys loaded: 0, keys expired: 0.
redis06        | 1:S 12 Sep 2022 06:17:46.390 * MASTER <-> REPLICA sync: Finished with success
redis06        | 1:S 12 Sep 2022 06:17:46.390 * Creating AOF incr file temp-appendonly.aof.incr on background rewrite
redis02        | 1:M 12 Sep 2022 06:17:46.391 * Background RDB transfer terminated with success
redis02        | 1:M 12 Sep 2022 06:17:46.391 * Streamed RDB transfer with replica 173.17.0.7:7006 succeeded (socket). Waiting for REPLCONF ACK from slave to enable streaming
redis02        | 1:M 12 Sep 2022 06:17:46.391 * Synchronization with replica 173.17.0.7:7006 succeeded
redis06        | 1:S 12 Sep 2022 06:17:46.391 * Background append only file rewriting started by pid 22
redis06        | 22:C 12 Sep 2022 06:17:46.392 * Successfully created the temporary AOF base file temp-rewriteaof-bg-22.aof
redis06        | 22:C 12 Sep 2022 06:17:46.392 * Fork CoW for AOF rewrite: current 0 MB, peak 0 MB, average 0 MB
redis06        | 1:S 12 Sep 2022 06:17:46.485 * Background AOF rewrite terminated with success
redis06        | 1:S 12 Sep 2022 06:17:46.485 * Successfully renamed the temporary AOF base file temp-rewriteaof-bg-22.aof into appendonly.aof.2.base.rdb
redis06        | 1:S 12 Sep 2022 06:17:46.485 * Successfully renamed the temporary AOF incr file temp-appendonly.aof.incr into appendonly.aof.2.incr.aof
redis06        | 1:S 12 Sep 2022 06:17:46.489 * Removing the history file appendonly.aof.1.incr.aof in the background
redis06        | 1:S 12 Sep 2022 06:17:46.489 * Removing the history file appendonly.aof.1.base.rdb in the background
redis06        | 1:S 12 Sep 2022 06:17:46.493 * Background AOF rewrite finished successfully
 

Check

$ docker exec -it redis01 redis-cli -p 7001
닫기
127.0.0.1:7001> cluster info
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
cluster_current_epoch:6
cluster_my_epoch:1
cluster_stats_messages_ping_sent:367
cluster_stats_messages_pong_sent:360
cluster_stats_messages_sent:727
cluster_stats_messages_ping_received:355
cluster_stats_messages_pong_received:367
cluster_stats_messages_meet_received:5
cluster_stats_messages_received:727
total_cluster_links_buffer_limit_exceeded:0
127.0.0.1:7001> cluster nodes
73b4d636e7c4b0e6d28e01ea1347a503bd15ab50 173.17.0.3:7002@17002 master - 0 1662963608000 2 connected 5461-10922
ca721ac17767523dfdeaeafd93007063f0753170 173.17.0.6:7005@17005 slave f1f993c453b358e7858b4946d0cfbe53df1b0d1c 0 1662963607000 1 connected
ea3f1551ab7f945bb714d7f94aa2c3fc7d8dbdd5 173.17.0.4:7003@17003 master - 0 1662963607782 3 connected 10923-16383
e74049c7d4ac68ead6fbb7d240995adec1dbe443 173.17.0.5:7004@17004 slave ea3f1551ab7f945bb714d7f94aa2c3fc7d8dbdd5 0 1662963608285 3 connected
9e267dec00ae0e623eef7379f1ddd010f46ea57f 173.17.0.7:7006@17006 slave 73b4d636e7c4b0e6d28e01ea1347a503bd15ab50 0 1662963608285 2 connected
f1f993c453b358e7858b4946d0cfbe53df1b0d1c 173.17.0.2:7001@17001 myself,master - 0 1662963607000 1 connected 0-5460
 

Test

$ docker exec -it redis01 redis-cli -c -h 173.17.0.2 -p 7001
173.17.0.2:7001> set a "testa"
-> Redirected to slot [15495] located at 173.17.0.4:7003
OK
173.17.0.4:7003> set b "testb"
-> Redirected to slot [3300] located at 173.17.0.2:7001
OK
173.17.0.2:7001> set d "testd"
-> Redirected to slot [11298] located at 173.17.0.4:7003
OK
173.17.0.4:7003> get a
"testa"
173.17.0.4:7003> get b
-> Redirected to slot [3300] located at 173.17.0.2:7001
"testb"
173.17.0.3:7002> get d
-> Redirected to slot [11298] located at 173.17.0.4:7003
"testd"
 

후기
이전에 Redis에 대한 내용을 다루어보아서 Docker로 로컬 환경에서 생성해보는 연습을 해보았습니다.

개인적으로 docker-compose 구성보다 kubernetes가 쉽다고 생각되어, 조만간 쿠버네티스로 올려보고 redis 공부를 마무리해보려고 합니다.