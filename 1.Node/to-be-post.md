# 라이브러리 제공

https://github.com/dosimpact/dodo-pluralize#readme
https://blog.ull.im/engineering/2018/12/23/how-to-create-and-publish-npm-module-in-typescript.html

## ref
- https://blog.ull.im/engineering/2018/12/23/how-to-create-and-publish-npm-module-in-typescript.html


## 사용되는 인프라
- 1. 깃허브 : 빌드전의 소스 코드를 저장한다. 
- 2. npm 레포 : 빌드 후 코드를 퍼블리시 한다. main 파일은 js 이고 type파일은 d.ts로 정의된다.
- 3. travis : 빌드 스크립트, 테스트 스크립트를 실행시키고, 커버리지 리포트를 생성하는 후속작업을 시행 (깃 푸쉬 이후)
- 4. coveralls : travis의 커버리지 리포트를 받아 문서화 한다.

## 프로젝트 구축 과정

프로젝트의 셋팅 및 베포 과정은 다음과 같다.
[1] 패키지 셋팅
- 1. package.json 설정
- 2. typescript 등 작업환경 구축
- 3. 소스 코드 및 테스트 코드 작성

[2] 패키지 베포
- 4. 빌드 스크립트 작성 및 깃허브 베포
- 5. npmignore 설정 및 Npm 베포
- 6. travis.yml 설정 및 CI 확인
- 7. Coveralls 설정 및 베포 확인

- 8. 버전 업데이트 해보기

## git 설정

git config --global user.email "ypd03008@gmail.com"  
git config --global user.name "dosimpact"  


## npm 설정 및 베포

// init 셋팅시, npm init -y 에 다음 내용을 추가시켜 준다.
npm set init.author.name "dosimpact"  
npm set init.author.email "ypd03008@gmail.com"  
npm set init.author.url "https://github.com/DosImpact"  

// (계정이 없다면)npm 가입은 adduser, 로그인은 npm login  
npm adduser     
npm login  

// 계정 확인하기   
npm config ls  

// 패키지 베포하기  
npm publish  


// 패키지 검색 및 정보
npm search dodo-pluralize  
npm info dodo-pluralize

// 패키지 베포 취소하기 (1시간 이내)
npm unpublish dodo-pluralize --force  

// 버전 업데이트 후 베포 ( 패치++1 (major.minor.patch++) )   
npm version patch -m "Version %s - add sweet badges"  
npm publish