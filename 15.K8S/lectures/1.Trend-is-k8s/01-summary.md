
- [섹션1 기초편 기초 다지기](#섹션1-기초편-기초-다지기)
- [Why Kubernetes?](#why-kubernetes)
- [VM vs Container](#vm-vs-container)
- [Getting started - Kubernetes](#getting-started---kubernetes)
- [Getting started - Kubernetes - 실습](#getting-started---kubernetes---실습)
- [Kubernetes Overview](#kubernetes-overview)
  - [Physical Machine](#physical-machine)
  - [Object](#object)
  - [Controller](#controller)

# 섹션1 기초편 기초 다지기
자료 : https://kubetm.github.io/k8s/


# Why Kubernetes?

Auto Scaling : 남은 서버 자원 분배
Auto Healing : 여분의 서버로 장애 회복 
Deployment : Rolling Update, ReCreate

# VM vs Container


VM과 Hypervisor Guest OS 유무의 차이가 가장 크다.
- 운영체제의 버전이 다르면 사용하는 기본 라이브러리도 다르다. 또한 설치된 Java,Node 등 버전도 다르게 동작한다.  

Container : OS에서 제공하는 자원격리 기술을 사용해서, 컨테이너라는 단위로 서비스를 분리 
- Container가 깔린 OS에서는 동일 환경을 제공
- Container 격리 기술은 리눅스 namespace, cgroups 을 사용한다.
- namespace : 커널 격리
- cgroups : 자원 격리 

VM과 다른 Container 의 단점 
- Linux OS 위에 Window 컨테이너를 뛰울 수 없다. 
- Host OS가 보안상 뚤리면, Container도 뚤릴 수 있다.

# Getting started - Kubernetes

K8S 배포 과정
1. 로컬 컴퓨터에서 개발 진행
2. 도커 이미지를 만들어서, docker-hub에 배포
3. k8s - Pod : Pod를 만들 yml 파일을 만들어서 배포
4. k8s - Service : 외부에서 접근할 수 있는 서비스를 만든다.


# Getting started - Kubernetes - 실습

https://kubetm.github.io/k8s/02-beginner/gettingstarted/


# Kubernetes Overview

## Physical Machine

물리적 서버 구성 : 마스터 서버 + 노드1 서버 + 노드2 서버 ... = 서버의 물리적 갯수를 늘릴 수 있다.
이 서버들의 논리적인 공간이 하나 만들어지는데, k8s cluster 라고 한다.

## Object

Namespaces : 클러스터의 공간을 논리적으로 독립된 공간으로 분리한다.  

Namespaces 안에는 Service + Pod + Pod.. 으로 구성된다.   
- Service : Pod에 외부 네트워크를 연결 시켜준다. 
- Pod : 컨테이너의 묶음으로 하나의 배포 단위 이다.   
- Volume : Pod의 데이터를 두는 공용 공간  

Namespaces - ResourceQuota / LimitRange : 네임스페이스 단위의 자원을 제한할 수 있다.  
ConfigMap / Secret : Pod에 환경설정값 주입  


## Controller 

Controller : Pod를 관리하는 역할, 여러가지 컨트롤러가 있다.  

Controller  
- Replication Controller, ReplicaSet : Pod의 갯수 조절, 죽으면 살리는 기능   
- Deployment : 새버전으로 Pod 업그레이드, 롤백 기능 
- DaemonSet : 한 노드에 하나의 파드만 나오도록 
- Cronjob : 특정 작업 주기적 실행 후 종료 하도록

