- [이점](#이점)
- [아키텍쳐](#아키텍쳐)
  - [마스터 노드 구성](#마스터-노드-구성)
  - [가상 네트워크](#가상-네트워크)
- [컴포넌트](#컴포넌트)
  - [Node \& Pod](#node--pod)
  - [Service \& Ingress](#service--ingress)
  - [ConfigMap \& Secret](#configmap--secret)
  - [Volume](#volume)
  - [Deployment \& StatefulSet](#deployment--statefulset)
- [K8S Configuration](#k8s-configuration)


https://www.youtube.com/watch?v=s_o8dwzRlu4



컨테이너 오케스트레이션 툴의 필요성
- 마이크로서비스로의 전환 트랜드
- 컨테이너 사용의 증가 


# 이점

- 고 가용성 제공 
- 확장성 제공
- 장애 극복 

# 아키텍쳐

노드 = 각각의 컴퓨터
- 마스터 노드 = 컨트롤 플랜
- 워커 노드 
- *kubelet : 각 노드에는 kubelet 프로세스가 필요.

## 마스터 노드 구성

1. API Server

2. Controller Manage 

3. Scheduler

4. etcd = 백업 저장소


## 가상 네트워크

모든 노드들을 하나로 합친 것 처럼 작동하도록 네트워크 구성

프로덕션 환경에서는 적어도 2개 이상의 마스터 노드를 두도록 한다.

# 컴포넌트

## Node & Pod

Node : 가상 혹은 물리적 머신

Pod : 가장 작은 단위 유닛
- 보통 메인 어플리케이션 하나를 두고 , 사이드 서비스를 붙여서 구성한다.
- Pod는 쉽게 죽을 수 있다. 다시 생성되면 새로운 IP를 할당받는다.

가상 네트워크
- 각 Pod는 IP 주소를 할당 받는다.

## Service & Ingress

Service
- 기본적으로 고정 IP 주소를 가진다. 각 Pod가 죽고 다시 살아나도 고정적인 IP로 접속 가능하다.
- Internal Service : DB등 내부에서 접속이 가능한 주소 eg) db-ip:port
- External Service : 외부에서 연결가능한 고정 주소를 가진다. eg) http://node-ip:port

Ingress
- https 프로토콜, 도메인 적용가능 하도록 만들어, Service와 연동하도록 한다.
- 트래픽을 라우팅 해주는 역할

## ConfigMap & Secret

ConfigMap
- mongo-db 등 URL 엔드포인트 설정 연결 파일
- 내부적인 Pod IP가 변경되어도, External Config는 변경되지 않도록 한다.

Secret
- ConfigMap 과 비슷한 역할을 하지만, 암호화 되어야 하는 데이터에 사용
- PWD,등

## Volume

Volume
- 하드디스크에 물리적 스토리지를 만들어 연결하는 것
- Cloud Remote Storage 혹은 온프레미스 디스크일 수 있다.

## Deployment & StatefulSet

Deployment
- Deployment는 Pod 배포의 청사진 이다. 몇개의 Pod를 뛰울 것인지 등등
- 서비스는 영구적인 IP를 가지고 있다. 이를 통해 접근이 가능
- Service는 로드밸러스 이기도 하여 요청을 적절한 Pod에 꽂아준다.  
- Stateless 한 경우에 deployment를 사용한다.

StatefulSet
- DB Pod같은 경우는 여러개 뛰운다고 동일성을 보장하지 않는다.
- 저장상태가 중요한 Pod는 StatefulSet 이라는 별도의 구성 요소를 제공
- MySQL, Elastic, MongoDB 등
- K8S로 DB를 관리하는것은 어려워, Cloud 서비스를 보통 사용한다.


# K8S Configuration

k8s로의 접속은 마스터 노드의 API Server로부터 시작된다.  
이곳에 접속은 Dashboard UI, API, CLI 등으로 가능하다.  
k8s Cluster에 대한 환경설정들을 진행할 수 있다.  

요청 방법 - blueprint
- yaml, json 형식을 사용, 배포에 대한 청사진을 요청하는 것이다.

파일 구성은 크게 3개 단락으로 존재


eg) nginx-deployment.yaml, nginx-service.yaml

1) Metadata

2) Specification
- 배포에 대한 상세 스펙을 적는 곳
- 이는 kind ( Deployment, Service ) 에 따라 다르다.

3) Status : k8s가 자동으로 추가하는 상태이다.
- 원하는 배포 상태와, 실제 배포상태는 다르다. 실제 배포를 적어주는 곳이다.
- 마스터 노드의 etcd에서 실제 배포 데이터를 가져 온다.