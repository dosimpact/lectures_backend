

# 도커 컨테이너 네트워크

## 컨테이너는 어떻게 통신하나요?

컨테이너 모델이 있다.
- 모든 컨테이너는 docker0를 통한다. 
- docker0라는 네트워크 인터페이스가 만들어 진다.
- L2통신기반, 컨테이너 생성시 - veth 인터페이스가 생성.
- 172.17.0.0/16 의 대역을 가진다. 
- 172.17.0.1 : 게이트 웨이 =  docker0
- 172.17.0.2 =  container1
- 172.17.0.3 =  container2
```
ip addr

# mac 
brew install iproute2mac
ip

```

## 컨테이너 포트를 외부로 노출할 수 있어요?

## 컨테이너 네트워크를 추가할 수 있나요?

## 컨테이너끼리 통신은 어떻게 하나요?