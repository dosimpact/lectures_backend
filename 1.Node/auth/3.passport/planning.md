
- [local strategy](#local-strategy)
  - [recap needed](#recap-needed)
- [jwt strategy](#jwt-strategy)

# local strategy


## recap needed


```js

[ 셋팅 ]
 
Passport localstrategy 를 사용 
1. Passport 내부 미들웨어 : new LocalStratogy: 
    1. 사용자 정보 DB조회 등 - > done 로그인 성공/실패 콜백 
2.  Passport 외부 미들웨어 : passport.authenticate
    1. successUrl, failUrl -> 리다이렉션 처리 

Passport.session : 세션정보를 사용
1. Session 미들웨어 반드시 , passport 초기화 전에 사용 
2. Session 시리얼라이즈, 디시리얼라이즈 사용 

[ 순서 - 로그인 할 때,]

1.내부 미들웨어, new LocalStratogy
	done(null,userData) 호출

2.passport.serializeUser( (user, done) {
	done(null, user.email // 식별자 ) 
})

3.session store 저장
Passport.user = 식별자



*로그인 성공시, 세션 스토어에 사용자 식별자를 저장하는 기능 

4.외부 미들웨어 호출 
- 성공 / 실패 미들웨어 타도록 

— 
[ 로그인 -  revalidate ] 

? 어떻게 로그인여부 호출  
- 모든 경로에 대해서, 세션이 있다면?? , 디시리얼 라이즈 


1.passport.deserializeUser
	사용자 식별자를 전달해주고, 실제DB 에서 사용자를 부르도록 한다. 
	done(null,authData)
	// 결과 request.user 가 주입된다. 
	-> 그래서 로그인 여부를 req.user로 판단

*로그인 이후, re-validate 로직을 처리
	세션정보와 DB정보가 일치하는지 계속 확인한다.

? 세션에서 디시리얼라이즈 되어서, req.user를  해줌.
그럼 기존의 res.session 도 있는건가? 

— 

? 그럼 두번 사용자를 DB에서 조회하게 되는건가? 
1. localStrategy 에서 - login. 
2. Deserialize 에서  - revalidate 

? Session + local - strategy  순서 정리하기 

—

[ 로그아웃 ]

req.logout 을 넣어 두었다. 

1.req.logout
2.req.session.destory 이후 리다이렉션
*대신에,
	res.session.save 이후 리다이렉션

문제점 :
	세션 삭제후 - 콜백으로 리다이렉션
지금 코드 :
	passport 로그아웃
	바로 응답 로그아굿
	-> 세션에 아직 로그인 되어 있는 현상. 
	https://opentutorials.org/course/3402/21880

```


# jwt strategy 

