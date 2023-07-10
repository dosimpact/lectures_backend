

- [Terms](#terms)
- [(Term) Polyfill vs Ponyfill vs Transpiler](#term-polyfill-vs-ponyfill-vs-transpiler)
- [(Term) isSecureContext](#term-issecurecontext)
- [Code](#code)
  - [downloadStrategy](#downloadstrategy)


# Terms

# (Term) Polyfill vs Ponyfill vs Transpiler

Transpiler는 오래된 브라우저들이 이해하지 못하는 최신 문법들을 오래된 문법으로 변경하여 브라우저들이 이해할 수 있도록 코드를 변환시켜주는 장치입니다.
Polyfill은 전역 스코프에 브라우저가 지원하지 않는 API 또는 기능을 구현하는데 사용합니다.
Ponyfill은 전역 스코프가 아닌 변수를 사용하여 전역 스코프에 영향 없이 브라우저가 지원하지 않는 API 또는 기능을 구현하는데 사용합니다.


# (Term) isSecureContext

https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
https://w3c.github.io/webappsec-secure-contexts/

http/https, iframe, service worker 상황에서 secure context 인지 아닌지 판단하는 함수
eg) http window - not secure
eg) https iframe in http window - not secure
eg) service worker from https iframe in http window - not secure


# Code

## downloadStrategy

iframe, navigate


