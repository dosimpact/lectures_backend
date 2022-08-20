
- [Section7 젠킨스 통합](#section7-젠킨스-통합)
  - [Email 통합](#email-통합)
- [eg4) Slack notification 통합](#eg4-slack-notification-통합)
  - [slack 통합](#slack-통합)
  - [깃 통합](#깃-통합)
  - [Sonarqube 통합](#sonarqube-통합)
    - [overview](#overview)
    - [sonar qube](#sonar-qube)

# Section7 젠킨스 통합

## Email 통합 

- 빌드 실패시 email을 통해 알려줄 수 있다.
- 이를 위해서는 SMTP 서버 설정이 되어야 함.

```Jenkinsfile

node {

  // config 
  def to = emailextrecipients([
          [$class: 'CulpritsRecipientProvider'],
          [$class: 'DevelopersRecipientProvider'],
          [$class: 'RequesterRecipientProvider']
  ])

  // job
  try {
    stage('build') {
      println('so far so good...')
    }
    stage('test') {
      println('A test has failed!')
      sh 'exit 1'
    }
  } catch(e) {
    // mark build as failed
    currentBuild.result = "FAILURE";
    // set variables
    def subject = "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} ${currentBuild.result}"
    def content = '${JELLY_SCRIPT,template="html"}'

    // send email
    if(to != null && !to.isEmpty()) {
      emailext(body: content, mimeType: 'text/html',
         replyTo: '$DEFAULT_REPLYTO', subject: subject,
         to: to, attachLog: true )
    }

    // mark current build as a failure and throw the error
    throw e;
  }
}

```

# eg4) Slack notification 통합 


## slack 통합

```js
node {

  // job
  try {
    stage('build') {
      println('so far so good...')
    }
    stage('test') {
      println('A test has failed!')
      sh 'exit 1'
    }
  } catch(e) {
    // mark build as failed
    currentBuild.result = "FAILURE";

    // send slack notification
    slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")

    // throw the error
    throw e;
  }
}
```

## 깃 통합

목적 :
- 젠킨스를 띄우고 빌드 파이프라인 아이템을 모두 구성하는것은 어렵다.
- 젠킨스 DSL 처럼, 다른 아이템을 언어로 정의하여 출력할 수 있다.
- 여기서의 방법은 깃 레포의 Jenkins 파이프라인 파일을 스캔하여 아이템을 만들어 주는 것


issue) 
.gradle을 젠킨스도커 안에 만들어준다.
```
mkdir -p /var/jenkins_home/.gradle
chown 1000:1000 /var/jenkins_home/.gradle
```

issue)
  args '-v $HOME/.m2:/tmp/jenkins-home/.m2'
  에서 $HOME이  # echo $HOME > /root 으로 되어 있다.
  그래서 불륨 마운티 이슈가 발생한다. 

  $HOME   /Users 으로 변경
  - ? 어떻게 해당 변수를 바꿀 수 있을까?

1. docker-compose.yml 의 변수는 .env에 설정한다.

```
// eg) REDIS_PASSWORD 을 정의한 env 파일을 명시하여, docker-compose 명령어 수행
      - redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
      #  docker-compose --env-file ./.env up -d
      # REDIS_PASSWORD=dosimpact
```

2. jenkins 도커 안에서 환경변수(리눅스 환경변수)

```
이슈) 
# (젠킨스도커안)echo $HOME 
/root

# (맥북) echo $HOME 
/Users/dos

젠킨스 도커는, 맥북의 docker 소켓을 이용하는데, $HOME에 대한 환경변수는 젠킨스도커 안쪽을 바라본다. 
- 얼라인 실패.

Dockerfile에 환경변수를 전달
- ARG는 Docker 이미지(RUN 등)를 빌드하는 동안에만 사용
- ENV 값은 컨테이너에서 사용할 수 있지만 Docker 빌드 중 RUN 스타일 명령이 도입된 줄부터 시작합니다


결과 
- jenkins docker 안에서 에코를 찍어보면 다음처럼 나온다. 

1. Dockerfile - ENV HELLO 1234 라고 정의
# echo $HELLO
1234

2. docker-compose.yml -     
  environment:
    - MY_NAME=${MY_NAME}
    - MY_AGE="23"
# echo $MY_AGE
"23"

3. docker-compose.yml -     
  environment:
    - MY_NAME=${MY_NAME} 
    // MY_NAME=DODO 라고 .env 에 정의
    // #  docker-compose --env-file ./.env up -d

# echo $MY_NAME
DODO

```

## Sonarqube 통합

### overview

Sonarqube
- 코드 품질에 대해 지속적으로 점검하는 SW이다.
- 코드 문제, 취약성, 보안, 코드 스멜, 등

sonar-scanner로 코드를 스캔
스캔 결과를 소나큐브 서버에 전송 ( 소나큐브 서버도 설치 )
- docker-compose로  소나큐브 서버, DB를 추가로 뛰운다.

### sonar qube 

docker-compose up 

```
version: '2'

services:
  jenkins:
    build:
      context: .
      dockerfile: ./Dockerfile
    restart: always
    ports:
      - "8080:8080"
      - "50000:50000"
    networks:
      - jenkins
    volumes:
      - /Users/dos/DockerVolumns/jenkins_home_v2:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
  postgres:
    image: postgres
    networks:
      - jenkins
    environment:
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonarpasswd
    volumes:
      - /Users/dos/DockerVolumns/postgres-data:/var/lib/postgresql/data
  sonarqube:
    image: mwizner/sonarqube:8.9.5-community
    ports:
      - "9000:9000"
      - "9092:9092"
    networks:
      - jenkins
    environment:
      SONARQUBE_JDBC_USERNAME: sonar
      SONARQUBE_JDBC_PASSWORD: sonarpasswd
      SONARQUBE_JDBC_URL: "jdbc:postgresql://postgres:5432/sonar"
    depends_on: 
      - postgres

networks:
  jenkins:
```

install plugins  

  SonarQube ScannerVersion
  - This plugin allows an easy integration of SonarQube, the open source platform for Continuous Inspection of code quality.

set-up global configure
 - sonar scanner 

set-up credential
  - sonar secret key 

pipeline
```
node {
    def myGradleContainer = docker.image('gradle:jdk8-alpine')
    myGradleContainer.pull()

    stage('prep') {
        git url: 'https://github.com/wardviaene/gs-gradle.git'
    }

    stage('build') {
      myGradleContainer.inside("-v ${env.HOME}/.gradle:/home/gradle/.gradle") {
        sh 'cd complete && /opt/gradle/bin/gradle build'
      }
    }

    stage('sonar-scanner') {
      def sonarqubeScannerHome = tool name: 'sonar', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
      withCredentials([string(credentialsId: 'sonar', variable: 'sonarLogin')]) {
        sh "${sonarqubeScannerHome}/bin/sonar-scanner -e -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=${sonarLogin} -Dsonar.projectName=gs-gradle -Dsonar.projectVersion=${env.BUILD_NUMBER} -Dsonar.projectKey=GS -Dsonar.sources=complete/src/main/ -Dsonar.tests=complete/src/test/ -Dsonar.language=java -Dsonar.java.binaries=."
      }
    }
}
```


