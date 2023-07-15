

- [Terms](#terms)
  - [(Term) Polyfill vs Ponyfill vs Transpiler](#term-polyfill-vs-ponyfill-vs-transpiler)
  - [(Term) isSecureContext](#term-issecurecontext)
  - [MIME\_types (Content-Type)](#mime_types-content-type)
- [github](#github)
- [Code](#code)
  - [downloadStrategy](#downloadstrategy)
  - [mitm.html](#mitmhtml)
  - [How does it work?](#how-does-it-work)
    - [solution](#solution)
- [Service Worker API](#service-worker-api)
  - [서비스 워커의 개념과 사용법](#서비스-워커의-개념과-사용법)
  - [다른 사용법 아이디어](#다른-사용법-아이디어)


# Terms

## (Term) Polyfill vs Ponyfill vs Transpiler

Transpiler는 오래된 브라우저들이 이해하지 못하는 최신 문법들을 오래된 문법으로 변경하여 브라우저들이 이해할 수 있도록 코드를 변환시켜주는 장치입니다.
Polyfill은 전역 스코프에 브라우저가 지원하지 않는 API 또는 기능을 구현하는데 사용합니다.
Ponyfill은 전역 스코프가 아닌 변수를 사용하여 전역 스코프에 영향 없이 브라우저가 지원하지 않는 API 또는 기능을 구현하는데 사용합니다.


## (Term) isSecureContext

https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
https://w3c.github.io/webappsec-secure-contexts/

http/https, iframe, service worker 상황에서 secure context 인지 아닌지 판단하는 함수
eg) http window - not secure
eg) https iframe in http window - not secure
eg) service worker from https iframe in http window - not secure

## MIME_types (Content-Type)

https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types 

# github 

https://github.com/jimmywarting/StreamSaver.js?


일부 브라우저에는 ReadableStream이 있지만 WritableStream은 없습니다. 
- web-streams-polyfill은 이 차이를 해결
- 기본 ReadableStream이 서비스 워커로 전송될 때 StreamSaver가 더 잘 작동하기 때문에 polyfill 대신 ponyfill을 로드하고 기존 구현을 재정의하는 것이 좋습니다.



# Code

## downloadStrategy

iframe, navigate


## mitm.html

https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0

mitm.html is the lite "man in the middle"

signal the opener's messageChannel to the service worker 
- service worker : stream 수신역할
- 작업자는 오프너(원래의 브라우저)에게 다운로드를 시작할 링크를 열도록 지시합니다.

## How does it work?

stream, file, blob을 저장하는 마법같은 추상화된 함수는 아직 없다.  
- 현재는 ObjectURLs + a link로 blob(file,image,sound..) 다운로드 링크를 만들 수 있다.
- 하지만 stream 은 불가능하다.  

서버에서 스트림을 처리하는것 처럼, 브라우저에서도 스트림 다운로드를 처리하는 것이다.
브라우저에는 우리가 생각하는 개념의 서버가 없는 대신 이 역할을 해줄 '서비스 워커'가 있다. 


### solution 
- to create a service worker that can intercept request and use respondWith() and 서버의 역할 수행

문제점 : 
- 1. 서비스 워커는 secure contexts 에서만 작동  
- 2. 서비스 워커는 작업이 없으면 5분 후 IDLE 상태로 빠짐

1. StreamSaver는 mitm 만듭니다 (이는 보안 컨텍스트을 가지고, github 정적 페이지에서 호스팅되는 HTML 파일이고, 서비스 작업자를 설치하는 코드가 있다.)  
( iframe(보안 컨텍스트에서) 또는 페이지가 안전하지 않은 경우 새 팝업에서 )   
2. postMessage를 사용하여 스트림(또는 DataChannel)을 service worker로 전송합니다.  
3. 그런 다음 service worker는 다운로드 링크를 만듭니다.  
4. IDLE로 빠지지 않도록 지속적으로 Ping을 날려준다.  


--- 

# Service Worker API

https://developer.mozilla.org/ko/docs/Web/API/Service_Worker_API


서비스 워커는 웹 응용 프로그램, 브라우저, 그리고 (사용 가능한 경우) 네트워크 사이의 프록시 서버 역할을 합니다. 
- 효과적인 오프라인 경험을 생성하고, 
- 네트워크 요청을 가로채서 네트워크 사용 가능 여부에 따라 적절한 행동을 
- 취하고, 서버의 자산을 업데이트할 수 있습니다. 
- 푸시 알림과 백그라운드 동기화 API로의 접근도 제공합니다.

## 서비스 워커의 개념과 사용법  

서비스 워커는 출처와 경로에 대해 등록하는 이벤트 기반 워커로서 JavaScript 파일의 형태를 갖고 있습니다. 서비스 워커는 연관된 웹 페이지/사이트를 통제하여 탐색과 리소스 요청을 가로채 수정하고, 리소스를 굉장히 세부적으로 캐싱할 수 있습니다. 이를 통해 웹 앱이 어떤 상황에서 어떻게 동작해야 하는지 완벽하게 바꿀 수 있습니다. (제일 대표적인 상황은 네트워크를 사용하지 못할 때입니다.)


- 서비스 워커는 워커 맥락에서 실행되기 때문에 DOM에 접근할 수 없습니다. 
- 또한 앱을 구동하는 주 JavaScript와는 다른 스레드에서 동작하므로 연산을 가로막지 않습니다(논 블로킹). 
- 서비스 워커는 온전히 비동기적으로 설계됐으며, 
- 그로 인해 동기적 XHR이나 웹 저장소 등의 API를 서비스 워커 내에서 사용할 수 없습니다.


서비스 워커는 보안 상의 이유로 HTTPS에서만 동작합니다. 
- 네트워크 요청을 수정할 수 있다는 점에서 중간자 공격에 굉장히 취약하기 때문입니다. 
- 또한 Firefox에서는 사생활 보호 모드에서 Service Worker API에 접근할 수 없습니다.


## 다른 사용법 아이디어

서비스 워커의 설계는 다음과 같은 용도로 사용하는 것도 감안했습니다.

- 백그라운드 데이터 동기화.
- 다른 출처에서의 리소스 요청을 응답.
- 위치정보, 자이로 센서 등 계산에 높은 비용이 들어가는 다수의 페이지에서 함께 사용할 수 있도록 데이터 업데이트를 중앙화.
- 개발 목적으로서 CoffeeScript, Less, CJS/AMD 모듈 등의 의존성 관리와 컴파일.
- 백그라운드 서비스 훅.
- 특정 URL 패턴에 기반한 사용자 지정 템플릿 제공.
- 성능 향상. 사진 앨범의 다음 사진 몇 장처럼, 사용자가 필요로 할 것으로 생각되는 리소스의 프리페칭 등.

미래의 서비스 워커는 웹 플랫폼이 네이티브 앱의 능력에 보다 근접하도록 여러 가지 유용한 기능을 수행할 수 있을 것입니다. 흥미롭게도 다른 명세에서도 서비스 워커 맥락을 사용할 수 있으며, 이미 다음과 같은 곳에서 사용하고 있습니다.

- 백그라운드 동기화: 아무 사용자도 사이트에 없을 때 서비스 워커를 가동해 캐시를 업데이트 하는 등의 작업을 수행.
- 푸시 메시지에 반응: 서비스 워커를 가동, 새로운 콘텐츠가 이용 가능하다는 메시지를 사용자에게 전송.
- 특정 시간과 날짜에 반응.
- 지오펜스 진입.

