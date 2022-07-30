
- [1. 젠킨스, CI, CD, SDLC](#1-젠킨스-ci-cd-sdlc)
- [2. 젠킨스 node.js 빌드](#2-젠킨스-nodejs-빌드)
  - [젠킨스 도커 설치](#젠킨스-도커-설치)
  - [젠킨스 접속 후 플러그인, 글로벌 환경 구성](#젠킨스-접속-후-플러그인-글로벌-환경-구성)
  - [빌드 잡 추가](#빌드-잡-추가)
- [3. node.js 빌드 후 도커 허브 업로드](#3-nodejs-빌드-후-도커-허브-업로드)
  - [젠켄스에서 외부 도커명령어를 쓰도록 연동](#젠켄스에서-외부-도커명령어를-쓰도록-연동)
  - [다시 실행](#다시-실행)
  - [확인](#확인)
  - [플러그인 설치](#플러그인-설치)
  - [cf) 다른 환경에서 안되면 ?](#cf-다른-환경에서-안되면-)

## ref)
https://github.com/wardviaene/jenkins-course
https://github.com/wardviaene/docker-demo
https://github.com/wardviaene/jenkins-docker

# 1. 젠킨스, CI, CD, SDLC  

젠킨스

- 자바로 작성된, CI, CD 오픈소스 툴 
- 빌드 및 베포 자동화에 사용된다.  
- 많은 플러그인이 있다.   


CI
- 지속적 통합 : SW 작업 복사본을 공유된 메인라인에 병합하는 라인  
- 여러 브랜치가 나뉘어져 있는데, 내 작업 브랜치를 나머지 프로젝트와 통합하는 과정  

CD 
- 지속적 베포 : 안정적으로 짧은 주기로 출시될 수 있도록 하는 방법론  


이점 (SDLC)
- 오류를 빨리 수정하도록 피드백 루프를 제공해준다. 
- dev/qa/stage/prod 에 베포를 언제든 할 수 있다
  - SDLC SW Development lifecycle 빠르게 진행

CI/CD within the SDLC

- Build - Test - Release - Deploy/Provision - Customer  
- * 빌드는 브랜치 가져오고, 컴파일 하는 과정
- * 릴리즈는 패키지 혹은 컨테이너가 결과물이다.   


# 2. 젠킨스 node.js 빌드

## 젠킨스 도커 설치

// port 8000 : master builder
// port 50000 ; slave builder
// volumn : save plugins 

```
docker run -itd \
  -p 50000:50000 \
  -p 8000:8080 \
  -v /home/ubuntu/workspace/volumns/jenkins:/var/jenkins_home \
  --name jenkins \
  --restart always  jenkins/jenkins:lts
```
password : /var/jenkins_home/secrets/initialAdminPassword

ref : https://jktech.tistory.com/41


## 젠킨스 접속 후 플러그인, 글로벌 환경 구성

1. 

빌드하려는 프로젝트가 nodejs 이므로 node가 설치되어 있어야 한다. 제공되는 플러그인으로 해결 가능
- 플러그인 설치 - node.js

2. 

Global Tool Configuration
- node.js 의 여러 버전을 설치하고 관리할 수 있다.  
- node.js 18버전을 지정하고 저장하여 설치되도록 하자. 


## 빌드 잡 추가

빌드 잡 추가 : node.js 프로젝트를 빌드하기 위해 잡을 추가하자   


1. 소스코드관리탭
깃허브 주소를 입력하자. HTTPS 입력을 하게되면 클론하는데 인증이 따로 필요없다
혹은 SSH 키를 추가하여 인증 후 당겨올 수 있다.

2. 빌드환경

Provide Node & npm bin/ folder to PATH 에, 글로벌환경구성에서 설치된 nodejs 버전을 선택한다.

3. 
빌드 스크립트 추가 
- 쉘스크립트에 npm install 


4. 빌드 결과확인 
/var/jenkins_home/workspace/nodejs-ex 에서 확인이 가능하다.  
애곳에 쉘 스크립트가 실행된 결과물이 보인다.  



# 3. node.js 빌드 후 도커 허브 업로드

## 젠켄스에서 외부 도커명령어를 쓰도록 연동

```
FROM jenkins/jenkins:lts
USER root

RUN mkdir -p /tmp/download && \
 curl -L https://download.docker.com/linux/static/stable/x86_64/docker-18.03.1-ce.tgz | tar -xz -C /tmp/download && \
 rm -rf /tmp/download/docker/dockerd && \
 mv /tmp/download/docker/docker* /usr/local/bin/ && \
 rm -rf /tmp/download && \
 groupadd -g 999 docker && \
 usermod -aG staff,docker jenkins

RUN apt-get update
# only test
RUN apt-get -y install sudo

USER jenkins
```

docker build -t jenkins-docker .

## 다시 실행

```
docker run -itd \
  -p 50000:50000 \
  -p 8000:8080 \
  -v /Users/dos/DockerVolumns/jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -u root \
  --name jenkins \
  --restart always  jenkins-docker:0.1
```

## 확인 

docker exec -it jenkins bash
docker ps
- jenkins 컨테이너 안에서, host docker 데몬의 명령어를 수행 할 수 있게 되었다.  


## 플러그인 설치

CloudBees Docker Build and PublishVersion 설치 

## cf) 다른 환경에서 안되면 ?

ref) https://postlude.github.io/2020/12/26/docker-in-docker/

젠킨스 docker in docker 설정 ?
직접 docker안에 데몬을 설치하는것은 비추천 한다. 다만 도커 cli를 설치하고 호스트의 도커데몬을 사용 하는 것을 권장  

요약  
리눅스 소켓 연동 ? 
- -v /var/run/docker.sock:/var/run/docker.sock \
도커 cli 설치
- apt-get install -y docker-ce-cli
그룹권한설정 
- 컨테이너 내부에 994 아이디로 docker 라는 그룹을 만들고 jenkins 유저를 docker 그룹에도 속하게 함으로써 젠킨스 job에서도 도커 명령어를 사용할 수 있게 되었습니다.
