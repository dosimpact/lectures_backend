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
- [Minikube 및 Kubectl - K8s 클러스터를 로컬로 설정](#minikube-및-kubectl---k8s-클러스터를-로컬로-설정)
    - [brew install minikube](#brew-install-minikube)
    - [minikue start, status](#minikue-start-status)
    - [minikube dashboard](#minikube-dashboard)
    - [kubectl get node](#kubectl-get-node)
    - [kubectl config get-contexts](#kubectl-config-get-contexts)
- [전체 데모 프로젝트: MongoDB로 WebApp 배포](#전체-데모-프로젝트-mongodb로-webapp-배포)
  - [구성](#구성)
  - [ConfigMap : MongoDB Endpoint](#configmap--mongodb-endpoint)
  - [Secret : MongoDB User\& PW](#secret--mongodb-user-pw)
  - [Deployment + Service : MongoDB Application with internal service](#deployment--service--mongodb-application-with-internal-service)
- [Deployment + Service : Web Application with external service](#deployment--service--web-application-with-external-service)
- [](#)
    - [kubectl get pod](#kubectl-get-pod)
- [Kubernetes 클러스터와 상호 작용](#kubernetes-클러스터와-상호-작용)
    - [kubectl apply](#kubectl-apply)
    - [kubectl get all](#kubectl-get-all)
    - [kubectl get, describe, logs](#kubectl-get-describe-logs)


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


# Minikube 및 Kubectl - K8s 클러스터를 로컬로 설정

k8s의 운용환경은 여러대의 컴퓨터에서 돌아간다.
마스터 노드와  다수의 워커노드가 필요한데, 실습환경에서 실제 컴퓨터들을 여러대 설치하는게 어렵다.
그래서 내 컴퓨터안에 Master + Worker 노드가 있는것 처럼 작동하도록 돕는것이 minikube 이다.  

kubectl 명령어는 minikube 뿐 아니라 실제 Cloud Cluster 과 상호작용 할 수 있다.
쉽게 생각해서 minikube라는 박스는 클러스터 라고 보면 되고, 그 안에 여러대의 노드(컴퓨터)가 있는 것이다.



설치 & 시작 - https://minikube.sigs.k8s.io/docs/start/

### brew install minikube

```
>brew install minikube

```

minikue 안에는 도커 컨테이너 런타임 환경이 설치되어 있다.
minikue 안의 도커는, minikue를 설치하는 컴퓨터의 도커를 이용한다.  
이를 위해 내 컴퓨터에 도커를 설치 해야 한다. (Docker in Docker 라고 보면 된다.)


### minikue start, status

```
>minikube start --driver docker
>minikube start --driver docker --ports=30100:30100


>minikube status
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

### minikube dashboard

```
미니큐브는 쉽게 대시보드를 시작할 수 있다. 아래 명령어로 시작
minikube dashboard
```

### kubectl get node

```
클러스터의 모든 노드를 표시한다.

>kubectl get node
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   35m   v1.27.3
```

### kubectl config get-contexts

```
여러개의 클러스터가 보이는 환경이라면, 아래 명령어로 확인
minikube 설치, docker desktop 으로 k8s환경 설치 등

>kubectl config get-contexts
CURRENT   NAME             CLUSTER          AUTHINFO         NAMESPACE
          docker-desktop   docker-desktop   docker-desktop
*         minikube         minikube         minikube         default

>kubectl config use-context docker-desktop                                                   
Switched to context "docker-desktop".
```

# 전체 데모 프로젝트: MongoDB로 WebApp 배포

## 구성

ConfigMap : MongoDB Endpoint
Secret : MongoDB User& PW

Deployment + Service : MongoDB Application with internal service
Deployment + Service : Web Application with external service


---

https://kubernetes.io/docs/concepts/configuration/configmap/#configmaps-and-pods

## ConfigMap : MongoDB Endpoint


```yaml
apiVersion: v1
kind: ConfigMap # configMap 파일
metadata: # 메타데이타, 이름은 임의로 지정
  name: mongo-config
data:
  # 실제 환경설정 데이타, key-value값으로 넣으면 된다.
  mongo-url: mongo-service

```
## Secret : MongoDB User& PW

```yaml
apiVersion: v1
kind: Secret
metadata: 
  name: mongo-secret
type: Opaque
data:
  mongo-user: bW9uZ291c2Vy # echo -n mongouser | base64  bW9uZ291c2Vy
  mongo-password: bW9uZ29wYXNzd29yZA==  # echo -n mongopassword | base64
```


## Deployment + Service : MongoDB Application with internal service

https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#creating-a-deployment
https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service


1. Pod안의 컨테이너 설정
template은 또 nested 한 metadata, spec 필드를 가진다. 이 부분이 Pod의 실제 설정값이다.
즉,  Deployment 타입 파일 안에는 여러개의 metadata, spec 를 가진 템플릿이 존재하고 이는 여러개의 컨테이너를 하나의 Pod으로 구성할 수 있음을 의미한다.

2. Label

모든 k8s의 컴포넌트에 label을 달 수 있다. 이는 key-value 쌍으로 구성된다.
replica 환경에서는 여러개의 Pod가 복제된다. 이때, replica set은 동일한 label을 가지게 된다.  
각각의 Pod는 또한 서로다른 unique name을 가지게 된다.  
- 따라서 template > metadata의 label은 필수 값이다. 반대로 다른 컴포넌트는 그렇지 않다.

3. Label Selectors
matchLabels 필드는 k8s가 여러 Pod안에 컨테이너를 선택할 수 있도록 선택자를 제공해준다.??

4. `---` 대시 3개를 이용해서 여러개의 설정파일을 연달아 쓸 수 있다. 



5. 서비스 selector 

요청을 어떤 Pod에 넣어줄지 선택해줘야 한다. 이는 label 매칭으로 가능하다.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo-deployment
  labels:
    app: mongo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template: # template은 또 nested 한 metadata, spec 필드를 가진다. 이 부분이 Pod의 실제 설정값이다.
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongodb
          image: mongo:5.0
          ports:
            - containerPort: 27017 # 컨테이너가 listen 할 포트
          env:
          - name: MONGO_INITDB_ROOT_USERNAME
            valueFrom:
              secretKeyRef:
                name: mongo-secret
                key: mongo-user
          - name: MONGO_INITDB_ROOT_PASSWORD
            valueFrom:
              secretKeyRef:
                name: mongo-secret
                key: mongo-password
---
apiVersion: v1
kind: Service
metadata:
  name: mongo-service
spec:
  selector:
    app: mongo # 위 label mongo 로 매칭 시켜준다.
  ports:
    - protocol: TCP
      port: 27017 # (8080 으로 접속하면, Pod의 특정 포트로 포워딩 시켜준다.)
      targetPort: 27017 # -p 8080:27017 와 같은 맥락


```


# Deployment + Service : Web Application with external service

1. 환경변수를 config, secret 에서 가져올 수 있다.

2. webapp은 external service로 변경하기 위해 NodePort 타입 및 cluster Portforwd가 필요하다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-deployment
  labels:
    app: webapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: webapp
  template: # template은 또 nested 한 metadata, spec 필드를 가진다. 이 부분이 Pod의 실제 설정값이다.
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webappdb # 컨테이너
        image: docker pull nanajanashia/k8s-demo-app:v1.0 # 컨테이너의 이미지
        ports:
        - containerPort: 3000 
          env:
            - name: USER_NAME
              valueFrom:
                secretKeyRef:
                  name: mongo-secret
                  key: mongo-user
            - name: USER_PWD
              valueFrom:
                secretKeyRef:
                  name: mongo-secret
                  key: mongo-password
            - name: DB_URL
              valueFrom:
                configMapKeyRef:
                  name: mongo-config
                  key: mongo-url
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  type: NodePort # default ClusterIP (as internal service)
  selector:
    app: webapp # 위 label webapp 로 매칭 시켜준다.
  ports:
    - protocol: TCP
      port: 3000 # (8080 으로 접속하면, Pod의 특정 포트로 포워딩 시켜준다.)
      targetPort: 3000 # -p 8080:27017 와 같은 맥락
      nodePort: 30100 # k8s node 밖에 열리는 Port NodeIP:NodePort ( 30000 ~ 32767 )

```

# 

### kubectl get pod

```
pod확인하기
>kubectl get pod
No resources found in default namespace.
```

# Kubernetes 클러스터와 상호 작용


### kubectl apply

```
블루브린트 yaml 을 적용시킨다.

kubectl apply -f mongo-config.yaml
kubectl apply -f mongo-secret.yaml
kubectl apply -f mongo.yaml
kubectl apply -f webapp.yaml
```

### kubectl get all
```
클러스터의 모든 컴포넌트 정보를 출력한다.
>kubectl get all

NAME                                     READY   STATUS             RESTARTS   AGE
pod/mongo-deployment-85d45f7888-d9wp6    1/1     Running            0          81s
pod/webapp-deployment-86566dbc59-bnbd9   0/1     InvalidImageName   0          27s

NAME                     TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/kubernetes       ClusterIP   10.96.0.1        <none>        443/TCP          94m
service/mongo-service    ClusterIP   10.98.138.231    <none>        27017/TCP        81s
service/webapp-service   NodePort    10.102.181.104   <none>        3000:30100/TCP   27s

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/mongo-deployment    1/1     1            1           81s
deployment.apps/webapp-deployment   0/1     1            0           27s

NAME                                           DESIRED   CURRENT   READY   AGE
replicaset.apps/mongo-deployment-85d45f7888    1         1         1       81s
replicaset.apps/webapp-deployment-86566dbc59   1         1         0       27s
```

### kubectl get, describe, logs

```
kubectl get node
kubectl get configmap
kubectl get secret
kubectl get pod
```

```
kubectl describe service webapp-service
kubectl describe pod webapp-deployment-8495df87ff-m5glb
```

pod로그 확인하기
>kubectl logs webapp-deployment-8495df87ff-m5glb

서비스 확인하기
>kubectl get svc

미니큐브 IP 확인하기
>minikube ip

>kubectl get node
>kubectl get node -o wide
NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
minikube   Ready    control-plane   99m   v1.27.3   192.168.94.2   <none>        Ubuntu 22.04.2 LTS   5.10.76-linuxkit   docker://24.0.4