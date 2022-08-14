
- [1. (concept) 젠킨스, CI, CD, SDLC](#1-concept-젠킨스-ci-cd-sdlc)
- [terms](#terms)
- [------](#------)
- [2. 젠킨스 node.js 빌드](#2-젠킨스-nodejs-빌드)
  - [젠킨스 도커 설치](#젠킨스-도커-설치)
  - [젠킨스 접속 후 플러그인, 글로벌 환경 구성](#젠킨스-접속-후-플러그인-글로벌-환경-구성)
  - [빌드 잡 추가 - (practice-eg1)](#빌드-잡-추가---practice-eg1)
- [3. node.js 빌드 후 도커 허브 업로드](#3-nodejs-빌드-후-도커-허브-업로드)
  - [젠켄스에서 외부 도커명령어를 쓰도록 연동](#젠켄스에서-외부-도커명령어를-쓰도록-연동)
  - [다시 실행](#다시-실행)
  - [확인](#확인)
  - [플러그인 설치](#플러그인-설치)
  - [이슈 트레킹 cf) 다른 환경에서 안되면 ?](#이슈-트레킹-cf-다른-환경에서-안되면-)
  - [파이프추가 : 도커 빌드 및 허브 이미지 업로드](#파이프추가--도커-빌드-및-허브-이미지-업로드)
- [4. (concept) Infrastructure as code and automation](#4-concept-infrastructure-as-code-and-automation)
- [------](#-------1)
- [5. Job DSL로 node.js 빌드하기](#5-job-dsl로-nodejs-빌드하기)
- [6. Job DSL로 node.js 빌드하기 + Docker Build, image Push](#6-job-dsl로-nodejs-빌드하기--docker-build-image-push)
- [------](#-------2)
- [7.(concept) Jenkins Pipeline](#7concept-jenkins-pipeline)
- [8. Nodejs + Jenkins pipeline (eg3) jenkins pipeline nodejs build 추가)](#8-nodejs--jenkins-pipeline-eg3-jenkins-pipeline-nodejs-build-추가)
- [22. 도커 컨테이너 내에서의 구축, 테스트, 실행](#22-도커-컨테이너-내에서의-구축-테스트-실행)
- [23. 시연: 도커 컨테이너 내에서의 구축, 테스트, 실행](#23-시연-도커-컨테이너-내에서의-구축-테스트-실행)

## ref)

code resource
https://github.com/wardviaene/jenkins-course
https://github.com/wardviaene/docker-demo

docker 명령어를 사용할 수 있는 jenkins 도커파일
  https://github.com/wardviaene/jenkins-docker

Jenkins 로 빌드 자동화하기 1 - GitHub 에 push 되면 자동 빌드하도록 구성
https://yaboong.github.io/jenkins/2018/05/14/github-webhook-jenkins/

Jenkins를 사용하여 Docker 이미지를 Docker Hub에 푸시하는 방법
https://blog.knoldus.com/how-to-push-a-docker-image-to-docker-hub-using-jenkins/

# 1. (concept) 젠킨스, CI, CD, SDLC  

젠킨스

- 자바로 작성된, CI/CD 오픈소스 툴 
- 빌드 및 베포 자동화에 사용된다.  
- 많은 플러그인이 있다. 
  - eg) node.js 런타임 및 버전관리 플러그인
  - eg) docker hub 베포 플러그인    


CI
- 지속적 통합 : SW 작업 복사본을 공유된 메인라인에 병합 
- 여러 브랜치가 나뉘어져 있는데, 내 작업 브랜치를 나머지 프로젝트와 통합하는 과정  

CD 
- 지속적 베포 : 안정적으로 짧은 주기로 출시될 수 있도록 하는 방법론  


CI/CD 이점
- 오류를 빨리 수정하도록 피드백 루프를 제공해준다. 
- dev/qa/stage/prod 에 베포를 언제든 할 수 있다
  - SDLC SW Development lifecycle 빠르게 진행
    *(SDLC - SW Development Life Cycle )


CI/CD within the SDLC

- Build - Test - Release - Deploy/Provision - Customer  
- * 빌드는 브랜치 가져오고, 컴파일 하는 과정
- * 릴리즈는 패키지 혹은 컨테이너가 결과물이다.   

# terms

SCM(Source Code Management System)

# ------

# 2. 젠킨스 node.js 빌드

## 젠킨스 도커 설치

* 추후, 젠킨스 안에서 docker 명령어를 쓰도록 연동한다.

// port 8000 : master builder
// port 50000 ; slave builder
// volumn : save plugins 

```
# 젠킨스만 뛰우는 명령어, 젠킨스에서 도커 명령어를 사용 불가.

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


## 빌드 잡 추가 - (practice-eg1)

빌드 잡 추가 : node.js 프로젝트를 빌드하기 위해 잡을 추가하자   

1. 소스코드관리탭  
깃허브 주소를 입력하자. 
  - https://github.com/wardviaene/docker-demo.git 
HTTPS 입력을 하게되면 클론하는데 인증이 따로 필요없다 혹은 SSH 키를 추가하여 인증 후 당겨올 수 있다.


2. 빌드환경  

node.js 환경 제공  
- Provide Node & npm bin/ folder to PATH   
  - 글로벌환경구성에서 설치된 nodejs 버전을 선택한다.  


3.  
빌드 스크립트 추가 
- Execute shell
  -  npm install 입력

--- 

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

--- 

## 플러그인 설치

CloudBees Docker Build and PublishVersion 설치 

Build
- Docker Build and Publish
  - 


## 이슈 트레킹 cf) 다른 환경에서 안되면 ?

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


## 파이프추가 : 도커 빌드 및 허브 이미지 업로드 

빌드탭에서 Docker Build and Publish 을 추가
- Repository Name : ehdudtkatka/nodejs-demo
   - (username)/(repo_name) 으로 설정하면 이미지이름에 username을 붙여 준다.
- Registry credentials : username , password 입력  


cf) 콘솔 확인 : docker push ehdudtkatka/nodejs-demo


---

+ 이슈 트래킹, 현재 사용하는 도커 데몬에서, docker login 을 한번 해주자.

  - 어째서인지 jenkins에 넣은 아이디,비밀번호가 작동하지 않는다.  
    denied: requested access to the resource is denied


# 4. (concept) Infrastructure as code and automation

문제점 : 
- 젠킨스 빌드 파이프라인을 UI에서 작업하면 변경사항을 추적하기 어렵고 실수 발생, 감사문제가 발생  
- 이러한 빌드 파이프라인 구성을 코드로써 저장하고, 깃에 관리하는것이 해결책  
- 버전제어를 통해서 감사, 기록, 롤백 등이 가능해진다.  

Jenkins Job DSL
- 코드는 젠킨스 잡을 생성,업데이트를 자동으로 해준다.  
- 그루비라는 언어를 통해 정의한다.  

JenkinsFile
- 프로젝트의 빌드 파라미터를 번들링 해준다.  

# ------

# 5. Job DSL로 node.js 빌드하기


이를위해서는 깃 레포를 두개를 만들어야 한다.  
1. node.js 어플리케이션 레포
2. Jenkins의 job DSL이 명시된 레포  

그래서 Jenkins에서 jobDSL 레포를 pull 하여, 명시된 스크립트에 따라 잡을 수행한다.

--- 

플러그인 설치 : job dsl

- scm : 버전관리를 어떻게 할 것인가 ?
- triggers : git을 당겨오는 주기
- wrappers : nodejs node,npm 명령어 사용을 위함
- steps : 쉘 스크립트 빌드 과정을 코드로 기록 

```js
job('NodeJS Docker example - eg2)') {
    scm {
        git('https://github.com/DosImpact/jenkins-node-test.git') {  node -> // is hudson.plugins.git.GitSCM
            node / gitConfigName('DSL User')
            node / gitConfigEmail('ypd03008@gmail.com')
        }
    }
    triggers {
        scm('H/5 * * * *')
    }
    wrappers {
        nodejs('NodeJS') // this is the name of the NodeJS installation in 
                         // Manage Jenkins -> Configure Tools -> NodeJS Installations -> Name
    }
    steps {
        dockerBuildAndPublish {
            repositoryName('ehdudtkatka/jenkins-node-test')
            tag('${GIT_REVISION,length=9}')
            registryCredentials('dockerhub') // credentials의 id값이 된다.
            forcePull(false)
            forceTag(false)
            createFingerprints(false)
            skipDecorate()
        }
    }
}
```

---

빌드 과정에 Process Job DSLs 을 추가하고, 
- Look on Filesystem : job-dsl/nodejs.groovy 설정하자.   

처음 빌드할때 오류가 나온다. 스크립트를 승인해야하는 일종의 안전장치가 걸려 있다.  
http://localhost:8000/scriptApproval/ 에 승인을 하자.


+ 이슈 트래킹) nodejs 이름 비일치
```
     wrappers {
        nodejs('nodejs') // this is the name of the NodeJS installation in 
                         // Manage Jenkins -> Configure Tools -> NodeJS Installations -> Name
```

# 6. Job DSL로 node.js 빌드하기 + Docker Build, image Push

Job DSL 빌드과정에, 그루비 파일을 추가하면 된다.
Process Job DSLs - DSL Scripts

```
job-dsl/nodejs.groovy
job-dsl/nodejsdocker.groovy
```

두개의 스크립트를 추가 했으니, 두개의 잡이 만들어진다.  
이미 있는 잡은 만들어 지지 않는다.  

- 스크립트 최초 실행 허용  
- docker hub repo 이름 확인  



# ------

# 7.(concept) Jenkins Pipeline

젠킨스 파이프라인은 , 코드로 빌드 스탭을 정의해 주는 것.  
마치 공장의 생산라인에 코드를 넣고, 제조 공정을 따라 결과물이 완성되는 파이프라인을 구축하는 것  
이런 파이프 라인을 DSL처럼 코드로 정의하는 것이다.  

- 빌드 스탭은 : Complie - test - deploy 등의 일련의 과정  
- 코드는 Git에서 관리되는 형상이며, 파이프라인의 형상이다.  

즉, 파이프라인 코드와 어플리케이션 코드는 다르다.  


젠킨스 파이프라인 vs 젠킨스 잡 DSL  
- 젠킨스 잡의 유형 중 에는 - 자유유형과 파이프라인이 있다.  
- 젠킨스 job dsl은 자유유형 및 파이프라인유형 모두 만들 수 있다.  


# 8. Nodejs + Jenkins pipeline (eg3) jenkins pipeline nodejs build 추가)

각 프로젝트에는 파이프라인을 정의한, Jenkinsfile 이름의 파일을 둔다.  

```js
misc/Jenkinsfile 에 위치

node { // 젠킨스잡을 실행할 노드 정의(마스터,슬래이브 등 )
   def commit_id // 변수 정의
   // 1. 단계
   stage('Preparation') {
     checkout scm
     sh "git rev-parse --short HEAD > .git/commit-id"                        
     commit_id = readFile('.git/commit-id').trim()
   }
   // 2. 단계
   stage('test') {
     nodejs(nodeJSInstallationName: 'nodejs') {
       sh 'npm install --only=dev'
       sh 'npm test'
     }
   }
   // 3. 단계
   stage('docker build/push') {
     docker.withRegistry('https://index.docker.io/v2/', 'dockerhub') {
       def app = docker.build("wardviaene/docker-nodejs-demo:${commit_id}", '.').push()
     }
   }
}
```

# 22. 도커 컨테이너 내에서의 구축, 테스트, 실행

격리된 도커 컨테이너 환경을 구축해서 빌드 및 테스트를 구행.
- 각 브랜치마다의 DB컨테이너를 뛰우고 테스트하고 싹 지울 수 있다.  
- 격리된 환경에서 테스트 및 실행해볼 수 있는 장점.  


# 23. 시연: 도커 컨테이너 내에서의 구축, 테스트, 실행

```js
node {
   def commit_id
   stage('Preparation') {
     checkout scm
     sh "git rev-parse --short HEAD > .git/commit-id"
     commit_id = readFile('.git/commit-id').trim()
   }
   stage('test') {
    // node:4.6 컨테이너에서 테스트 예정
     def myTestContainer = docker.image('node:4.6')
     // 캐시 당겨오기.
     myTestContainer.pull()
     // 컨테이너 안에서 실행하는 명령어
     myTestContainer.inside {
       sh 'npm install --only=dev'
       sh 'npm test'
     }
     // 이 단계가 끝나면 컨테이너는 폐기된다.
   }
   stage('test with a DB') {
      //  mysql 컨테이너와 함께 두고 테스트를 하려고 한다.
     def mysql = docker.image('mysql').run("-e MYSQL_ALLOW_EMPTY_PASSWORD=yes") 
     def myTestContainer = docker.image('node:4.6')
     myTestContainer.pull()
     myTestContainer.inside("--link ${mysql.id}:mysql") { // using linking, mysql will be available at host: mysql, port: 3306
          sh 'npm install --only=dev' 
          sh 'npm test'                     
     }                                   
     mysql.stop()
   }                                     
   stage('docker build/push') {            
     docker.withRegistry('https://index.docker.io/v2/', 'dockerhub') {
       def app = docker.build("wardviaene/docker-nodejs-demo:${commit_id}", '.').push()
     }                                     
   }                                       
}                                          
```