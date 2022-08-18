
- [Section7 젠킨스 통합](#section7-젠킨스-통합)
  - [Email 통합](#email-통합)
- [eg4) Slack notification 통합](#eg4-slack-notification-통합)
  - [slack 통합](#slack-통합)
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


